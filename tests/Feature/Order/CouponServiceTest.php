<?php

namespace Tests\Unit\Services\Discount;

use App\DTOs\Order\OrderItemDTO;
use App\Exceptions\CheckoutException;
use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use App\Services\CartService;
use App\Services\Discount\CouponService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Factories\CheckoutContextFactory;
use Tests\TestCase;

class CouponServiceTest extends TestCase
{
    use RefreshDatabase;

    private CouponService $service;
    private OrderService $orderService ;

    protected function setUp(): void
    { 
        parent::setUp();
        $this->service = app(CouponService::class);
        $this->orderService = app(OrderService::class);
    }

    // ═══════════════════════════════════════════════════════
    // getDbCouponCodeMatch
    // ═══════════════════════════════════════════════════════

    public function test_returns_coupon_when_code_matches_and_is_active(): void
    {
        $coupon = Coupon::factory()->active()->create(['code' => 'SAVE10']);

        $result = $this->service->getDbCouponCodeMatch('SAVE10');

        $this->assertNotNull($result);
        $this->assertEquals($coupon->id, $result->id);
    }

    public function test_returns_null_for_inactive_coupon(): void
    {
        Coupon::factory()->inactive()->create(['code' => 'DEAD10']);

        $result = $this->service->getDbCouponCodeMatch('DEAD10');

        $this->assertNull($result);
    }

    public function test_returns_null_for_nonexistent_code(): void
    {
        $result = $this->service->getDbCouponCodeMatch('DOESNOTEXIST');

        $this->assertNull($result);
    }

    // ═══════════════════════════════════════════════════════
    // checkIsValidCoupon
    // ═══════════════════════════════════════════════════════

    public function test_throws_when_no_user_provided(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('requires an account');

        $coupon = Coupon::factory()->active()->create();
        $this->service->checkIsValidCoupon($coupon, null);
    }

    public function test_throws_when_coupon_is_expired(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('not valid at this time');

        $user   = User::factory()->create();
        $coupon = Coupon::factory()->expired()->create();

        $this->service->checkIsValidCoupon($coupon, $user);
    }

    public function test_throws_when_coupon_is_not_yet_valid(): void
    {
        $this->expectException(CouponException::class);

        $user   = User::factory()->create();
        $coupon = Coupon::factory()->notYetValid()->create();

        $this->service->checkIsValidCoupon($coupon, $user);
    }

    public function test_throws_when_global_usage_limit_exhausted(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('maximum of use');

        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->exhausted()->create();

        $this->service->checkIsValidCoupon($coupon, $user);
    }

    public function test_throws_when_user_has_reached_per_user_limit(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('maximum number of uses');

        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->create(['max_uses_per_user' => 1]);

        // Simulate user already used it once (delivered order)
        Order::factory()->delivered()->create([
            'user_id'   => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        $this->service->checkIsValidCoupon($coupon, $user);
    }

    public function test_passes_when_user_under_per_user_limit(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->active()->create(['max_uses_per_user' => 2]);

        Order::factory()->delivered()->create([
            'user_id'   => $user->id,
            'coupon_id' => $coupon->id,
        ]);

        // Should NOT throw — user has 1 use, limit is 2
        $this->service->checkIsValidCoupon($coupon, $user);
        $this->assertTrue(true);
    }

    // ═══════════════════════════════════════════════════════
    // assertCouponApplicable
    // ═══════════════════════════════════════════════════════

    public function test_throws_when_eligible_subtotal_below_minimum_amount(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('minimum amount');

        $coupon = Coupon::factory()->active()->withMinimumAmount(500)->create();

        // items total 200
        $items = $this->makeRawItems(2, 100);

        $this->service->assertCouponApplicable($coupon, $items);
    }

    public function test_throws_when_eligible_item_count_below_minimum(): void
    {
        $this->expectException(CouponException::class);
        $this->expectExceptionMessage('enough items');

        $coupon = Coupon::factory()->active()->withMinimumItems(5)->create();

        // only 2 items
        $items = $this->makeRawItems(2, 100);

        $this->service->assertCouponApplicable($coupon, $items);
    }

    public function test_passes_when_eligible_items_meet_all_requirements(): void
    {
        $coupon = Coupon::factory()->active()
            ->withMinimumAmount(100)
            ->withMinimumItems(2)
            ->create();

        $items = $this->makeRawItems(3, 100); // subtotal 300, 3 items

        $this->service->assertCouponApplicable($coupon, $items);
        $this->assertTrue(true);
    }

    // ═══════════════════════════════════════════════════════
    // calculateDiscount
    // ═══════════════════════════════════════════════════════

    public function test_fixed_discount_returns_flat_value(): void
    {
        $coupon = Coupon::factory()->fixed()->create(['value' => 50]);

        $result = $this->service->calculateDiscount($coupon, 300.0);

        $this->assertEquals(50.0, $result);
    }

    public function test_percentage_discount_calculated_correctly(): void
    {
        $coupon = Coupon::factory()->percentage()->create(['value' => 20]); // 20%

        $result = $this->service->calculateDiscount($coupon, 200.0);

        $this->assertEquals(40.0, $result); // 20% of 200
    }

    public function test_percentage_discount_not_multiplied_raw_value(): void
    {
        // Regression: old bug multiplied value * total instead of (value/100) * total
        $coupon = Coupon::factory()->percentage()->create(['value' => 10]);

        $result = $this->service->calculateDiscount($coupon, 100.0);

        $this->assertEquals(10.0, $result); // should be 10, NOT 1000
    }

    // ═══════════════════════════════════════════════════════
    // CouponApplicationResult
    // ═══════════════════════════════════════════════════════

    public function test_returns_null_when_no_coupon_code_in_dto(): void
    {
        $user    = User::factory()->create();
        $context = CheckoutContextFactory::make($user, 2, null); // no coupon

        $result = $this->service->CouponApplicationResult($context);

        $this->assertNull($result);
    }

    public function test_returns_null_when_coupon_code_not_found_in_db(): void
    {
        $user    = User::factory()->create();
        $coupon  = Coupon::factory()->active()->create(['code' => 'REAL99']);

        // Use a fake coupon object just to pass a code, but wrong code
        $fakeCoupon = Coupon::factory()->make(['code' => 'GHOST00']);
        $context    = CheckoutContextFactory::make($user, 2, $fakeCoupon);

        $result = $this->service->CouponApplicationResult($context);

        $this->assertNull($result);
    }

    public function test_returns_null_when_coupon_is_expired(): void
    {
        $user   = User::factory()->create();
        $coupon = Coupon::factory()->expired()->create();
        // expired() sets is_active=false, so getDbCouponCodeMatch won't find it
        // so result will be null from the DB lookup
        $context = CheckoutContextFactory::make($user, 2, $coupon);

        $result = $this->service->CouponApplicationResult($context);

        $this->assertNull($result);
    }

    public function test_returns_null_for_guest_user(): void
    {
        $coupon  = Coupon::factory()->active()->create();
        $context = CheckoutContextFactory::make(null, 2, $coupon); // no user

        $result = $this->service->CouponApplicationResult($context);

        $this->assertNull($result);
    }

    // ═══════════════════════════════════════════════════════
    // updateCouponInOrderUsage
    // ═══════════════════════════════════════════════════════

    public function test_increments_times_used(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 5,
        ]);

        $this->service->updateCouponInOrderUsage($coupon->id);

        $this->assertEquals(1, $coupon->fresh()->times_used);
    }

    public function test_deactivates_coupon_when_max_uses_reached(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 4,
            'max_uses'   => 5,
        ]);

        $this->service->updateCouponInOrderUsage($coupon->id);

        $fresh = $coupon->fresh();
        $this->assertEquals(5, $fresh->times_used);
        $this->assertFalse((bool)$fresh->is_active);
    }

    public function test_does_not_deactivate_when_unlimited(): void
    {
        $coupon = Coupon::factory()->active()->create([
            'times_used' => 99,
            'max_uses'   => null, // unlimited
        ]);

        $this->service->updateCouponInOrderUsage($coupon->id);

        $fresh = $coupon->fresh();
        $this->assertEquals(100, $fresh->times_used);
        $this->assertTrue((bool)$fresh->is_active);
    }

    public function test_throws_when_coupon_already_exhausted(): void
    {
        $this->expectException(\Exception::class);

        $coupon = Coupon::factory()->exhausted()->create();

        $this->service->updateCouponInOrderUsage($coupon->id);
    }

    public function test_throws_when_coupon_not_found(): void
    {
        $this->expectException(\Exception::class);

        $this->service->updateCouponInOrderUsage(99999);
    }



    // ═══════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════

    /**
     * Build raw array items (as assertCouponApplicable expects).
     * NOTE: getCartEligibility currently only returns one item per key due to
     * a bug ($eligibility['eligibleItems'] = $item instead of []).
     * These helpers test assertCouponApplicable directly with raw arrays.
     */
    private function makeRawItems(int $count, float $unitSubtotal): array
    {
        return array_map(fn($i) => [
            'quantity' => 1,
            'subtotal' => $unitSubtotal,
            'product'  => ['id' => $i, 'sub_categories' => [], 'nich_category' => []],
        ], range(1, $count));
    }
}