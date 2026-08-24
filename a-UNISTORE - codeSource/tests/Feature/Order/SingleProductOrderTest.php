<?php

namespace Tests\Unit\Services;

use App\Context\Order\SingleOrderContext;
use App\DTOs\Order\CreateOrderDTO;
use App\DTOs\Order\OrderItemDTO;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Services\DtoService;
use App\Services\OrderService;
use App\Services\ShippingService;
use App\Services\TaxService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class SingleProductOrderTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $orderService;
    private DtoService   $dtoService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mock(ShippingService::class, function ($mock) {
            $mock->shouldReceive('calculateShipping')->andReturn(30.0);
        });

        $this->mock(TaxService::class, function ($mock) {
            $mock->shouldReceive('calculate')->andReturn(0.0);
        });

        $this->orderService = app(OrderService::class);
        $this->dtoService   = app(DtoService::class);
    }

    // ═══════════════════════════════════════════════════════
    // prepareItemsToMatchCheckoutItemDTO — shape correctness
    // ═══════════════════════════════════════════════════════

    public function test_prepared_items_have_required_keys(): void
    {
        [$variant, $params] = $this->makeVariantAndParam(price: 200, quantity: 2);

        $items  = collect([$variant->id => $variant]);
        $result = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, collect([$params]));

        $item = $result[0];
        $this->assertArrayHasKey('product_variant_id', $item);
        $this->assertArrayHasKey('quantity', $item);
        $this->assertArrayHasKey('price_snapshot', $item);
        $this->assertArrayHasKey('subtotal', $item);
        $this->assertArrayHasKey('product_variant', $item);
    }

    public function test_subtotal_is_price_times_quantity(): void
    {
        [$variant, $params] = $this->makeVariantAndParam(price: 150, quantity: 3);

        $items  = collect([$variant->id => $variant]);
        $result = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, collect([$params]));

        $this->assertEquals(450, $result[0]['subtotal']);
    }

    public function test_product_variant_contains_product_relation(): void
    {
        [$variant, $params] = $this->makeVariantAndParam(price: 100, quantity: 1);

        $items  = collect([$variant->id => $variant]);
        $result = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, collect([$params]));

        $this->assertArrayHasKey('product', $result[0]['product_variant']);
        $this->assertEquals($variant->product->id, $result[0]['product_variant']['product']['id']);
    }

    public function test_multiple_items_prepared_correctly(): void
    {
        [$variant1, $params1] = $this->makeVariantAndParam(price: 100, quantity: 1);
        [$variant2, $params2] = $this->makeVariantAndParam(price: 200, quantity: 2);

        $items  = collect([
            $variant1->id => $variant1,
            $variant2->id => $variant2,
        ]);
        $result = $this->dtoService->prepareItemsToMatchCheckoutItemDTO(
            $items,
            collect([$params1, $params2])
        );

        $this->assertCount(2, $result);
        $this->assertEquals(100, $result[0]['subtotal']);
        $this->assertEquals(400, $result[1]['subtotal']);
    }

    // ═══════════════════════════════════════════════════════
    // OrderItemDTO::fromArray — mapping correctness
    // ═══════════════════════════════════════════════════════

    public function test_order_item_dto_maps_product_correctly(): void
    {
        [$variant, $params] = $this->makeVariantAndParam(price: 100, quantity: 1);

        $items     = collect([$variant->id => $variant]);
        $prepared  = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, collect([$params]));
        $dto       = OrderItemDTO::fromArray($prepared[0]);

        $this->assertEquals($variant->product->id, $dto->product['id']);
        $this->assertEquals($variant->product->name, $dto->product_name);
    }

    public function test_order_item_dto_toArray_has_product_key(): void
    {
        [$variant, $params] = $this->makeVariantAndParam(price: 100, quantity: 1);

        $items    = collect([$variant->id => $variant]);
        $prepared = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, collect([$params]));
        $dto      = OrderItemDTO::fromArray($prepared[0]);
        $array    = $dto->toArray();

        // ItemEligibilityService reads $item['product']['id']
        $this->assertArrayHasKey('product', $array);
        $this->assertArrayHasKey('id', $array['product']);
    }

    // ═══════════════════════════════════════════════════════
    // Full placeOrder flow with single product items
    // ═══════════════════════════════════════════════════════

    public function test_single_product_order_creates_order_in_db(): void
    {
        $user    = User::factory()->create();
        $context = $this->makeSingleOrderContext($user, 1);

        $order = $this->orderService->placeOrder($context);

        $this->assertNotNull($order);
        $this->assertDatabaseHas('orders', ['id' => $order->id]);
    }

    public function test_single_product_order_stores_correct_item_count(): void
    {
        $user    = User::factory()->create();
        $context = $this->makeSingleOrderContext($user, 2);

        $order = $this->orderService->placeOrder($context);

        $this->assertCount(2, $order->items);
    }

    public function test_single_product_order_total_includes_shipping(): void
    {
        $user    = User::factory()->create();
        $context = $this->makeSingleOrderContext($user, 1, price: 200);

        $order = $this->orderService->placeOrder($context);

        // 1 item × 200 + 30 shipping + 0 tax = 230
        $this->assertEquals(230, $order->total_amount);
    }

    public function test_single_product_order_with_coupon_applies_discount(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->create([
            'type'                        => 'fixed',
            'value'                       => 50,
            'times_used'                  => 0,
            'max_uses'                    => 10,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'max_uses_per_user'           => 5,
        ]);

        $context = $this->makeSingleOrderContext($user, 1, price: 200, coupon: $coupon);
        $order   = $this->orderService->placeOrder($context);

        $this->assertEquals(50, $order->discount_amount);
        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    public function test_single_product_guest_order_has_tracking_token(): void
    {
        $context = $this->makeSingleOrderContext(null, 1);
        $order   = $this->orderService->placeOrder($context);

        $this->assertNotNull($order->tracking_token);
        $this->assertNull($order->user_id);
    }

    public function test_single_product_coupon_discount_for_specific_product(): void
    {
        $user    = User::factory()->create();
        $variant = $this->makeVariantWithProduct(price: 200);

        $coupon = Coupon::factory()->active()->create([
            'type'                        => 'fixed',
            'value'                       => 30,
            'times_used'                  => 0,
            'max_uses'                    => 10,
            'applicable_product_ids'      => [$variant->product->id], // only for this product
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'max_uses_per_user'           => 5,
        ]);

        $context = $this->makeSingleOrderContextFromVariants($user, [$variant], $coupon);
        $order   = $this->orderService->placeOrder($context);

        $this->assertEquals(30, $order->discount_amount);
    }

    // ═══════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════

    private function makeVariantWithProduct(float $price = 100): ProductVariant
    {
        $product = Product::factory()->create();
        return ProductVariant::factory()->create([
            'product_id' => $product->id,
            'price'      => $price,
        ]);
    }

    private function makeVariantAndParam(float $price, int $quantity): array
    {
        $variant = $this->makeVariantWithProduct($price);
        $param   = ['variant_id' => $variant->id, 'quantity' => $quantity];
        return [$variant->load('product'), $param];
    }

    private function makeSingleOrderContext(
        ?User $user,
        int $itemCount,
        float $price = 200,
        ?Coupon $coupon = null
    ): SingleOrderContext {
        $variants = collect(range(1, $itemCount))->map(
            fn() => $this->makeVariantWithProduct($price)->load('product')
        );

        return $this->makeSingleOrderContextFromVariants($user, $variants->all(), $coupon);
    }

    private function makeSingleOrderContextFromVariants(
        ?User $user,
        array $variants,
        ?Coupon $coupon = null
    ): SingleOrderContext {
        $params = collect($variants)->map(fn($v) => [
            'variant_id' => $v->id,
            'quantity'   => 1,
        ]);

        $items   = collect($variants)->keyBy('id');
        $prepared = $this->dtoService->prepareItemsToMatchCheckoutItemDTO($items, $params);

        $dto = CreateOrderDTO::fromRequest(
            array_merge(
                [
                    'items'          => $prepared,
                    'payment_method' => 'cod',
                    'notes'          => null,
                    'coupon_code'    => $coupon?->code,
                    'address' => [
                    'first_name'    => 'Test',
                    'last_name'     => 'User',
                    'address_line1' => '123 Test St',
                    'address_line2' => null,
                    'city'          => 'Casablanca',
                    'phone'         => '0600000000',
                    'email'         => null,
                ]
                ]
            ),
            $user
        );

        return new SingleOrderContext($dto, $user);
    }
}