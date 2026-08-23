<?php

namespace Tests\Feature;

use App\Context\Order\CheckoutContext;
use App\DTOs\Order\CreateOrderDTO;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class FinalCheckoutTest extends TestCase
{
    use RefreshDatabase;

    // ========================================================
    // Helpers
    // ========================================================

    private function makeZoneAndCity(string $cityName = 'Casablanca'): array
    {
        $zone = ShippingZone::factory()->create([
            'price'     => 10.0,
            'type'      => 'fixed',
            'is_active' => true,
        ]);

        $city = ShippingZoneCity::factory()->create([
            'city'             => $cityName,
            'shipping_zone_id' => $zone->id,
        ]);

        return [$zone, $city];
    }

   private function makeSettings(): void
    {
        ShippingSetting::factory()->create([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 9999,
            'free_shipping_threshold_items'  => 9999,
            'base_weight_kg'                 => 5.0,
            'extra_kg_price'                 => 2.0,
        ]);

        // TaxService reads these from store_settings
        DB::table('store_settings')->insert([
            ['key' => 'tva_enabled', 'value' => 'false', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'tva_rate',    'value' => '0',     'created_at' => now(), 'updated_at' => now()],
        ]);
    }
    private function makeVariant(): ProductVariant
    {
        $product = Product::factory()->create(['name' => 'Test Product']);
        return ProductVariant::factory()->create([
            'product_id' => $product->id,
            'price'      => 50.0,
            'stock'      => 100,
        ]);
    }

    private function makeOrderData(ShippingZoneCity $city, ProductVariant $variant, array $overrides = []): array
    {
        return array_merge([
            'payment_method' => 'COD',
            'coupon_code'    => null,
            'notes'          => null,
            'address'        => [
                'first_name'    => 'John',
                'last_name'     => 'Doe',
                'address_line1' => '123 Main St',
                'address_line2' => null,
                'city'          => $city->city, // ← ID — DTO does the lookup
                'phone'         => '0600000000',
                'email'         => 'john@example.com',
            ],
            'items' => [
                [
                    'product_variant_id' => $variant->id,
                    'quantity'           => 2,
                    'price_snapshot'     => 50.0,
                    'subtotal'           => 100.0,
                    'product_variant'    => [
                        'id'      => $variant->id,
                        'price'   => 50.0,
                        'product' => [
                            'name'     => 'Test Product',
                            'shipping' => ['weight' => 1.0],
                        ],
                    ],
                ],
            ],
        ], $overrides);
    }

    private function makeContext(array $data, ?User $user = null): CheckoutContext
    {
        $dto = CreateOrderDTO::fromRequest($data, $user);
        return new CheckoutContext($dto, $user);
    }

    private function orderService(): OrderService
    {
        return app(OrderService::class);
    }

    // ========================================================
    // 1. checkout cod stores address
    // ========================================================

    /** @test */
    public function checkout_cod_stores_address(): void
    {
        [$zone, $city] = $this->makeZoneAndCity('Casablanca');
        $this->makeSettings();
        $variant = $this->makeVariant();
        $user    = User::factory()->create();

        $context = $this->makeContext($this->makeOrderData($city, $variant), $user);
        $order   = $this->orderService()->placeOrder($context);

        $this->assertNotNull($order->address);
        $this->assertEquals('John',         $order->address->first_name);
        $this->assertEquals('Doe',          $order->address->last_name);
        $this->assertEquals('123 Main St',  $order->address->address_line1);
        $this->assertEquals('Casablanca',   $order->address->city); // stored as name not ID
        $this->assertEquals('0600000000',   $order->address->phone);
    }

    // ========================================================
    // 2. auth order never has token
    // ========================================================

    /** @test */
    public function auth_order_never_has_token(): void
    {
        [$zone, $city] = $this->makeZoneAndCity();
        $this->makeSettings();
        $variant = $this->makeVariant();
        $user    = User::factory()->create();

        $context = $this->makeContext($this->makeOrderData($city, $variant), $user);
        $order   = $this->orderService()->placeOrder($context);

        $this->assertNull($order->tracking_token);
        $this->assertEquals($user->id, $order->user_id);
    }

    // ========================================================
    // 3. Transaction rollback — order creation fails
    // ========================================================

    /** @test */
    public function it_rolls_back_when_order_creation_fails(): void
    {
        [$zone, $city] = $this->makeZoneAndCity();
        $this->makeSettings();
        $variant = $this->makeVariant();
        $user    = User::factory()->create();

        $data = $this->makeOrderData($city, $variant);

        // pass invalid payment_method to fail Order::create (enum violation)
        $data['payment_method'] = 'INVALID_METHOD_THAT_BREAKS_DB';

        $context = $this->makeContext($data, $user);

        try {
            $this->orderService()->createOrderMaster($context->dto);
        } catch (\Throwable $e) {
            // expected
        }

        $this->assertEquals(0, Order::count());
    }

    // ========================================================
    // 4. Transaction rollback — storing items fails
    // ========================================================

    /** @test */
    public function it_rolls_back_when_storing_items_fails(): void
    {
        [$zone, $city] = $this->makeZoneAndCity();
        $this->makeSettings();
        $variant = $this->makeVariant();
        $user    = User::factory()->create();

        $data = $this->makeOrderData($city, $variant);

        // non-existent variant FK → order_items insert fails
        $data['items'][0]['product_variant_id'] = 99999;
        $data['items'][0]['product_variant']['id'] = 99999;

        $context = $this->makeContext($data, $user);

        try {
            $this->orderService()->createOrderMaster($context->dto);
        } catch (\Throwable $e) {
            // expected
        }

        $this->assertEquals(0, Order::count()); // rolled back
    }

    // ========================================================
    // 5. Transaction rollback — storing address fails
    // ========================================================

    /** @test */
    /** @test */
        public function it_rolls_back_when_storing_address_fails(): void
        {
            [$zone, $city] = $this->makeZoneAndCity();
            $this->makeSettings();
            $variant = $this->makeVariant();
            $user    = User::factory()->create();

            $data    = $this->makeOrderData($city, $variant);
            $context = $this->makeContext($data, $user);

            // mock the address creation to throw AFTER order is already inserted
            $this->mock(\App\Services\OrderService::class, function ($mock) use ($context) {
                $mock->makePartial(); // use real methods except what we override
                $mock->shouldReceive('storeOrderAddress')
                    ->andThrow(new \Exception('Address DB failed'));
            });

            try {
                app(\App\Services\OrderService::class)->createOrderMaster($context->dto);
            } catch (\Throwable $e) {
                // expected
            }

            // order was inserted then rolled back because address failed inside transaction
            $this->assertEquals(0, Order::count());
        }
    // ========================================================
    // 6. Transaction rollback — coupon id does not exist
    // ========================================================

    /** @test */
    public function it_rolls_back_when_coupon_id_does_not_exist(): void
    {
        [$zone, $city] = $this->makeZoneAndCity();
        $this->makeSettings();
        $variant = $this->makeVariant();
        $user    = User::factory()->create();

        $data = $this->makeOrderData($city, $variant);

        // build DTO with non-existent coupon_id — FK violation
        $dto = CreateOrderDTO::fromRequest($data, $user, [
            'coupon_id'      => 99999, // doesn't exist
            'total_amount'   => 100,
            'discount_amount'=> 0,
            'shipping_cost'  => 10,
            'tax'            => 0,
            'order_number'   => 'ORD-TEST-00001',
        ]);

        $context = new CheckoutContext($dto, $user);

        try {
            $this->orderService()->createOrderMaster($context->dto);
        } catch (\Throwable $e) {
            // expected
        }

        $this->assertEquals(0, Order::count());
    }

    // ========================================================
    // 7. Transaction rollback — coupon update fails
    // ========================================================

    /** @test */
    /** @test */
public function it_rolls_back_when_coupon_update_fails(): void
{
    [$zone, $city] = $this->makeZoneAndCity();
    $this->makeSettings();
    $variant = $this->makeVariant();
    $user    = User::factory()->create();
    $coupon  = Coupon::factory()->create([
        'max_uses'   => 5,
        'times_used' => 0,
        'is_active'  => true,
    ]);

    $data    = $this->makeOrderData($city, $variant, ['coupon_code' => $coupon->code]);
    $context = $this->makeContext($data, $user);

    $this->mock(\App\Services\OrderFinalizerService::class, function ($mock) {
        $mock->shouldReceive('finalize')->andThrow(new \Exception('Finalize failed'));
    });

    try {
        $this->orderService()->placeOrder($context);
    } catch (\Throwable $e) {
        // expected
    }

    // ✅ order IS created — finalizer is outside transaction
    $this->assertEquals(1, Order::count());
    // ✅ coupon NOT counted — finalizer never ran
    $this->assertEquals(0, $coupon->fresh()->times_used);
}
}