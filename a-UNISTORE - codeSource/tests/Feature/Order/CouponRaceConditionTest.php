<?php

namespace Tests\Unit\Services;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use App\Services\OrderService;
use App\Services\ShippingService;
use App\Services\TaxService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

class CouponRaceConditionTest extends TestCase
{
    use RefreshDatabase;

    private OrderService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mock(ShippingService::class, function ($mock) {
            $mock->shouldReceive('calculateShipping')->andReturn(30.0);
        });

        $this->mock(TaxService::class, function ($mock) {
            $mock->shouldReceive('calculate')->andReturn(0.0);
        });

        $this->service = app(OrderService::class);
    }

    // ═══════════════════════════════════════════════════════
    // Simulated race condition — two users, one coupon use left
    // ═══════════════════════════════════════════════════════

    public function test_only_one_order_gets_coupon_counted_when_two_users_checkout_simultaneously(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'type'                        => 'fixed',
            'value'                       => 50,
            'max_uses'                    => 1,   // only ONE use allowed
            'times_used'                  => 0,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
            'max_uses_per_user'           => 5,
        ]);

        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $contextA = CheckoutContextFactory::make($userA, 2, $coupon);
        $contextB = CheckoutContextFactory::make($userB, 2, $coupon);

        // Simulate both passing validation at the same time
        // by running both checkouts back to back before finalize
        // This is the closest we can get without real threads in PHP
        $orderA = $this->service->placeOrder($contextA);
        $orderB = $this->service->placeOrder($contextB);

        $couponFresh = $coupon->fresh();

        // Both orders should exist — order creation never fails for coupon reasons
        $this->assertDatabaseHas('orders', ['id' => $orderA->id]);
        $this->assertDatabaseHas('orders', ['id' => $orderB->id]);

        // times_used should never exceed max_uses
        $this->assertLessThanOrEqual(1, $couponFresh->times_used);

        // Only one order should have coupon_counted = true
        $countedOrders = Order::where('coupon_id', $coupon->id)
                              ->where('coupon_counted', true)
                              ->count();

        $this->assertEquals(1, $countedOrders);
    }

    public function test_coupon_not_double_counted_when_finalize_called_twice(): void
    {
        // Simulates a retry scenario — finalize called twice on same order
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 10,
        ]);

        $order = Order::factory()->create([
            'coupon_id'      => $coupon->id,
            'coupon_counted' => false,
        ]);

        $finalizer = app(\App\Services\OrderFinalizerService::class);

        $finalizer->finalize($order);
        $finalizer->finalize($order->fresh()); // second call — should be skipped

        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    public function test_db_conditional_update_prevents_over_incrementing(): void
    {
        // Directly tests the updateCouponInOrderUsage conditional WHERE clause
        // Two calls on a max_uses=1 coupon — second must throw
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 1,
        ]);

        $couponService = app(\App\Services\Discount\CouponService::class);

        // First call succeeds
        $couponService->updateCouponInOrderUsage($coupon->id);
        $this->assertEquals(1, $coupon->fresh()->times_used);

        // Second call must throw — the WHERE condition fails
        $this->expectException(\Exception::class);
        $couponService->updateCouponInOrderUsage($coupon->id);
    }

    public function test_order_has_coupon_counted_false_when_finalize_fails(): void
    {
        // Coupon exhausted between order creation and finalize
        // Order must survive, coupon_counted must stay false for audit
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 1,
        ]);

        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $contextA = CheckoutContextFactory::make($userA, 2, $coupon);
        $contextB = CheckoutContextFactory::make($userB, 2, $coupon);

        $orderA = $this->service->placeOrder($contextA);
        $orderB = $this->service->placeOrder($contextB);

        // One order has coupon_counted true, the other false
        $countedTrue  = Order::where('coupon_id', $coupon->id)->where('coupon_counted', true)->count();
        $countedFalse = Order::where('coupon_id', $coupon->id)->where('coupon_counted', false)->count();

        $this->assertEquals(1, $countedTrue);
        $this->assertEquals(1, $countedFalse); // survives but flagged for audit
    }
}