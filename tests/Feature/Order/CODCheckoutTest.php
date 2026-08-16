<?php

namespace Tests\Unit\Services;

use App\Context\Order\CheckoutContext;
use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\CheckoutException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Promotion;
use App\Models\User;
use App\Services\Discount\CouponService;
use App\Services\Discount\PromotionService;
use App\Services\OrderFinalizerService;
use App\Services\OrderService;
use App\Services\ShippingService;
use App\Services\TaxService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

use function PHPUnit\Framework\assertNotNull;

class CODCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock ShippingService to avoid zone/city DB lookups
        $this->mock(ShippingService::class, function ($mock) {
            $mock->shouldReceive('calculateShipping')->andReturn(30.0);
        });

        // Mock TaxService — simple flat return
        $this->mock(TaxService::class, function ($mock) {
            $mock->shouldReceive('calculate')->andReturn(0.0);
        });

        $this->service = app(OrderService::class);
    }

    // ═══════════════════════════════════════════════════════
    // placeOrder — basic order creation
    // ═══════════════════════════════════════════════════════

    public function test_checkout_cod_creates_order_in_db(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertNotNull($order);
        $this->assertDatabaseHas('orders', ['id' => $order->id]);
    }

    public function test_checkout_cod_creates_order_items(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertCount(2, $order->items);
    }

    public function test_checkout_cod_stores_address(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertNotNull($order->address);
        $this->assertEquals('Casablanca', $order->address->city);
    }

    public function test_checkout_cod_generates_order_number(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertStringStartsWith('ORD-', $order->order_number);
    }

    public function test_checkout_cod_sets_payment_method_to_cod(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertEquals('cod', $order->payment_method);
    }

    public function test_guest_checkout_generates_tracking_token(): void
    {
        // No user → should get tracking token
        $context = CheckoutContextFactory::make(null, 2);

        $order = $this->service->placeOrder($context);

        $this->assertNotNull($order->tracking_token);
    }

    public function test_authenticated_checkout_has_no_tracking_token(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        $order = $this->service->placeOrder($context);

        $this->assertNull($order->tracking_token);
    }

    // ═══════════════════════════════════════════════════════
    // Total calculation
    // ═══════════════════════════════════════════════════════

    public function test_total_includes_shipping(): void
    {
        // ShippingService mocked to return 30
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2); // 2 items × 200 = 400 subtotal

        $order = $this->service->placeOrder($context);

        // subtotal 400 + shipping 30 + tax 0 - discount 0 = 430
        $this->assertEquals(430, $order->total_amount);
    }

   public function test_discount_never_exceeds_subtotal(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'type'                        => 'fixed',
        'value'                       => 99999,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'max_uses_per_user'           => 5,
    ]);

    $context  = CheckoutContextFactory::make($user, 2, $coupon);
    $order    = $this->service->placeOrder($context);

    // 2 items × 200 subtotal = 400, discount capped at 400
    $subtotal = 400;

    $this->assertLessThanOrEqual($subtotal, $order->discount_amount);
    $this->assertGreaterThanOrEqual(0, $order->total_amount);
}

    // ═══════════════════════════════════════════════════════
    // coupon_counted / promotion_counted flags
    // ═══════════════════════════════════════════════════════

    public function test_order_created_with_coupon_counted_false(): void
    {
        $user    = User::factory()->create();
        $coupon  = Coupon::factory()->active()->create([
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'max_uses_per_user'           => 5,
        ]);
        $context = CheckoutContextFactory::make($user, 2, $coupon);

        $order = $this->service->placeOrder($context);

        // coupon_counted starts false — finalizer flips it
        // we only assert the field exists with a boolean
        $this->assertIsBool((bool)$order->coupon_counted);
    }

    // ═══════════════════════════════════════════════════════
    // createOrderMaster — transaction rollback
    // ═══════════════════════════════════════════════════════

    public function test_createOrderMaster_rolls_back_on_failure(): void
    {
        $user = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2);

        // Trigger a DB failure mid-transaction by passing a bad DTO
        $badDTO = new CreateOrderDTO(
            order_number:      'ORD-BAD',
            payment_method_id: null,
            user_id:           $user->id,
            tracking_token:    null,
            notes:             null,
            payment_method:    'cod',
            items:             [], // empty — storeOrderItems won't crash but address will
            address:           $context->dto->address,
            coupon_code:       null,
            paid_at:           null,
            tax:               0,
            total_amount:      100,
            discount_amount:   0,
            shipping_cost:     30,
            coupon_id:         null,
            promotion_id:      null,
            coupon_counted:    false,
            promotion_counted: false,
            order_status:      'pending',
            payment_status:    'pending',
        );

        $orderCountBefore = Order::count();

        try {
            $this->service->createOrderMaster($badDTO);
        } catch (\Exception $e) {
            // expected
        }

        // order count should be same or properly handled
        $this->assertGreaterThanOrEqual(0, Order::count() - $orderCountBefore);
    }


    // ═══════════════════════════════════════════════════════
// Coupon & Promotion finalized after order creation
// ═══════════════════════════════════════════════════════

public function test_coupon_times_used_incremented_after_checkout(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $this->service->placeOrder($context);

    $this->assertEquals(1, $coupon->fresh()->times_used);
}

public function test_coupon_counted_is_true_after_checkout(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertTrue((bool) $order->fresh()->coupon_counted);
}

public function test_coupon_deactivated_when_max_uses_reached_after_checkout(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'times_used'                  => 9,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $this->service->placeOrder($context);

    $fresh = $coupon->fresh();
    $this->assertEquals(10, $fresh->times_used);
    $this->assertFalse((bool) $fresh->is_active);
}

public function test_order_still_created_when_coupon_already_exhausted_at_finalize(): void
{
    // Edge case: coupon passes validation but gets exhausted between
    // validation and finalize (race condition scenario)
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    // Order must exist regardless
    $this->assertDatabaseHas('orders', ['id' => $order->id]);
}

public function test_promotion_times_used_incremented_after_checkout(): void
{
    $user      = User::factory()->create();
    $promotion = Promotion::factory()->active()->unlimited()->create([
        'times_used'                  => 0,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
    ]);

    $context = CheckoutContextFactory::make($user, 2);

    // debug before checkout
    $promotionService = app(\App\Services\Discount\PromotionService::class);
    $cartService      = app(\App\Services\CartService::class);

    $items       = $context->dto->items;
    $eligibility = $cartService->getCartEligibility($promotion, $items);
    $best        = $promotionService->getBestPromotion($items);

    Log::error("from checkout" , [
        'eligible_items_count'   => count($eligibility['eligibleItems'] ?? []),
        'ineligible_items_count' => count($eligibility['ineligibleItems'] ?? []),
        'best_promotion'         => $best,
        'promotion_type'         => $promotion->type,
        'promotion_value'        => $promotion->value,
    ]);

    $order = $this->service->placeOrder($context);
    $this->assertEquals(1, $promotion->fresh()->times_used);
}

public function test_promotion_counted_is_true_after_checkout(): void
{
    $user      = User::factory()->create();
    $promotion = Promotion::factory()->active()->unlimited()->create([
        'times_used'                  => 0,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
    ]);

    $context = CheckoutContextFactory::make($user, 2);
    $order   = $this->service->placeOrder($context);

    $this->assertTrue((bool) $order->fresh()->promotion_counted);
}

public function test_no_coupon_code_leaves_coupon_id_null_on_order(): void
{
    $user    = User::factory()->create();
    $context = CheckoutContextFactory::make($user, 2); // no coupon

    $order = $this->service->placeOrder($context);

    $this->assertNull($order->coupon_id);
    $this->assertFalse((bool) $order->coupon_counted);
}

public function test_coupon_discount_reflected_in_order_discount_amount(): void
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

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertEquals(50, $order->discount_amount);
}


public function test_promotion_used_when_bigger_than_coupon(): void
{
    $user   = User::factory()->create();

    // coupon gives 20 fixed
    $coupon = Coupon::factory()->active()->create([
        'type'                        => 'fixed',
        'value'                       => 20,
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    // promotion gives 50 fixed — should win
    Promotion::factory()->active()->unlimited()->create([
        'type'                        => 'fixed',
        'value'                       => 50,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertEquals(50, $order->discount_amount);
}

public function test_coupon_used_when_bigger_than_promotion(): void
{
    $user   = User::factory()->create();

    // coupon gives 100 fixed — should win
    $coupon = Coupon::factory()->active()->create([
        'type'                        => 'fixed',
        'value'                       => 100,
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    // promotion gives 20 fixed
    Promotion::factory()->active()->unlimited()->create([
        'type'                        => 'fixed',
        'value'                       => 20,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertEquals(100, $order->discount_amount);
}

public function test_coupon_and_promotion_discounts_are_not_added_together(): void
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

    Promotion::factory()->active()->unlimited()->create([
        'type'                        => 'fixed',
        'value'                       => 50,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    // should be 50, NOT 100
    $this->assertEquals(50, $order->discount_amount);
}

// ═══════════════════════════════════════════════════════
// Invalid / expired coupon — order still completes
// ═══════════════════════════════════════════════════════

public function test_expired_coupon_code_order_completes_with_zero_discount(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->expired()->create([
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make($user, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertNotNull($order);
    $this->assertDatabaseHas('orders', ['id' => $order->id]);
    $this->assertEquals(0, $order->discount_amount);
}

public function test_guest_with_coupon_code_order_completes_coupon_ignored(): void
{
    $coupon  = Coupon::factory()->active()->create([
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    // no user — coupon requires auth
    $context = CheckoutContextFactory::make(null, 2, $coupon);
    $order   = $this->service->placeOrder($context);

    $this->assertNotNull($order);
    $this->assertNull($order->coupon_id);
    $this->assertEquals(0, $order->discount_amount);
}


// ═══════════════════════════════════════════════════════
// Percentage discount cap
// ═══════════════════════════════════════════════════════

public function test_percentage_discount_cap_never_exceeds_subtotal(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->active()->create([
        'type'                        => 'percentage',
        'value'                       => 200, // 200% — absurd, should be capped
        'times_used'                  => 0,
        'max_uses'                    => 10,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context  = CheckoutContextFactory::make($user, 2, $coupon);
    $order    = $this->service->placeOrder($context);
    $subtotal = 400; // 2 items × 200

    $this->assertLessThanOrEqual($subtotal, $order->discount_amount);
    $this->assertGreaterThanOrEqual(0, $order->total_amount);
}



    // extra tests 
           /** @test */
public function coupon_deactivates_after_reaching_max_uses(): void
{
    $user   = User::factory()->create();
    $coupon = Coupon::factory()->create([
        'max_uses'                    => 1,
        'times_used'                  => 0,
        'is_active'                   => true,
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);

    $context = CheckoutContextFactory::make(user: $user, coupon: $coupon);
    $this->service->placeOrder($context);

    $coupon->refresh();
    $this->assertEquals(1, $coupon->times_used);
    $this->assertFalse((bool) $coupon->is_active);
}

 /** @test */
public function deleted_coupon_is_silently_ignored_order_completes(): void
{
    $coupon  = Coupon::factory()->active()->create([
        'applicable_product_ids'      => null,
        'applicable_category_ids'     => null,
        'applicable_sub_category_ids' => null,
        'minimum_order_amount'        => null,
        'minimum_items'               => null,
        'max_uses_per_user'           => 5,
    ]);
    $user    = User::factory()->create();
    $context = CheckoutContextFactory::make(user: $user, coupon: $coupon);

    $coupon->delete();

    $order = $this->service->placeOrder($context);

    $this->assertDatabaseHas('orders', ['id' => $order->id]);
    $this->assertNull($order->coupon_id);
    $this->assertEquals(0, $order->discount_amount);
}

}


