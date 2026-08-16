<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Promotion;
use App\Services\OrderFinalizerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;


class checkoutFinalizerTest extends TestCase
{
    use RefreshDatabase;

    private OrderFinalizerService $finalizer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->finalizer = app(OrderFinalizerService::class);
    }

    public function test_finalize_increments_coupon_times_used(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 10,
        ]);

        $order = Order::factory()->create([
            'coupon_id'      => $coupon->id,
            'coupon_counted' => false,
        ]);

        $this->finalizer->finalize($order);

        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    public function test_finalize_sets_coupon_counted_true(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 10,
        ]);

        $order = Order::factory()->create([
            'coupon_id'      => $coupon->id,
            'coupon_counted' => false,
        ]);

        $this->finalizer->finalize($order);

        $this->assertTrue((bool)$order->fresh()->coupon_counted);
    }

    public function test_finalize_skips_coupon_if_already_counted(): void
    {
        $coupon = Coupon::factory()->active()->create(['times_used' => 0]);

        $order = Order::factory()->create([
            'coupon_id'      => $coupon->id,
            'coupon_counted' => true, // already done
        ]);

        $this->finalizer->finalize($order);

        // times_used should NOT have incremented again
        $this->assertEquals(0, $coupon->fresh()->times_used);
    }

    public function test_finalize_increments_promotion_times_used(): void
    {
        $promotion = Promotion::factory()->active()->unlimited()->create([
            'times_used' => 0,
        ]);

        $order = Order::factory()->create([
            'promotion_id'      => $promotion->id,
            'promotion_counted' => false,
        ]);

        $this->finalizer->finalize($order);

        $this->assertEquals(1, $promotion->fresh()->times_used);
    }

    public function test_finalize_sets_promotion_counted_true(): void
    {
        $promotion = Promotion::factory()->active()->unlimited()->create();

        $order = Order::factory()->create([
            'promotion_id'      => $promotion->id,
            'promotion_counted' => false,
        ]);

        $this->finalizer->finalize($order);

        $this->assertTrue((bool)$order->fresh()->promotion_counted);
    }

    public function test_finalize_skips_promotion_if_already_counted(): void
    {
        $promotion = Promotion::factory()->active()->unlimited()->create(['times_used' => 0]);

        $order = Order::factory()->create([
            'promotion_id'      => $promotion->id,
            'promotion_counted' => true,
        ]);

        $this->finalizer->finalize($order);

        $this->assertEquals(0, $promotion->fresh()->times_used);
    }

    public function test_finalize_skips_both_when_no_coupon_or_promotion(): void
    {
        $order = Order::factory()->create([
            'coupon_id'    => null,
            'promotion_id' => null,
        ]);

        // Should complete without exceptions
        $this->finalizer->finalize($order);
        $this->assertTrue(true);
    }

    public function test_order_survives_when_coupon_update_fails(): void
    {
        // Coupon is already exhausted — updateCouponInOrderUsage will throw
        // but the order should still exist (coupon_counted remains false)
        $coupon = Coupon::factory()->exhausted()->create();

        $order = Order::factory()->create([
            'coupon_id'      => $coupon->id,
            'coupon_counted' => false,
        ]);

        // finalize wraps in its own transaction — the order stays
        try {
            $this->finalizer->finalize($order);
        } catch (\Exception $e) {
            // finalize currently lets the exception bubble — order still in DB
        }

        $this->assertDatabaseHas('orders', ['id' => $order->id]);
        $this->assertFalse((bool)$order->fresh()->coupon_counted);
    }


    
}
