<?php

namespace Tests\Unit\Services\Discount;

use App\Exceptions\PromotionException;
use App\Models\Promotion;
use App\Services\Discount\PromotionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromotionServiceTest extends TestCase
{
    use RefreshDatabase;

    private PromotionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PromotionService::class);
    }

    // ═══════════════════════════════════════════════════════
    // getDbPromotions
    // ═══════════════════════════════════════════════════════

    public function test_returns_only_active_promotions(): void
    {
        Promotion::factory()->active()->create();
        Promotion::factory()->inactive()->create();

        $results = $this->service->getDbPromotions();

        $this->assertCount(1, $results);
    }

    public function test_excludes_expired_promotions(): void
    {
        Promotion::factory()->active()->create();
        Promotion::factory()->expired()->create();

        $results = $this->service->getDbPromotions();

        $this->assertCount(1, $results);
    }

    public function test_excludes_not_yet_valid_promotions(): void
    {
        Promotion::factory()->active()->create();
        Promotion::factory()->notYetValid()->create();

        $results = $this->service->getDbPromotions();

        $this->assertCount(1, $results);
    }

    public function test_excludes_exhausted_promotions(): void
    {
        Promotion::factory()->active()->create();
        Promotion::factory()->exhausted()->create();

        $results = $this->service->getDbPromotions();

        $this->assertCount(1, $results);
    }

    public function test_includes_unlimited_promotion(): void
    {
        Promotion::factory()->active()->unlimited()->create();

        $results = $this->service->getDbPromotions();

        $this->assertCount(1, $results);
    }

    // ═══════════════════════════════════════════════════════
    // checkIsValidPromotion
    // ═══════════════════════════════════════════════════════

    public function test_throws_when_promotion_exhausted(): void
    {
        $this->expectException(PromotionException::class);
        $this->expectExceptionMessage('maximum number of uses');

        $promotion = Promotion::factory()->exhausted()->create();
        $this->service->checkIsValidPromotion($promotion);
    }

    public function test_throws_when_promotion_expired(): void
    {
        $this->expectException(PromotionException::class);
        $this->expectExceptionMessage('not valid at this time');

        $promotion = Promotion::factory()->expired()->create();
        $this->service->checkIsValidPromotion($promotion);
    }

    public function test_throws_when_promotion_not_yet_valid(): void
    {
        $this->expectException(PromotionException::class);

        $promotion = Promotion::factory()->notYetValid()->create();
        $this->service->checkIsValidPromotion($promotion);
    }

    public function test_passes_for_valid_active_promotion(): void
    {
        $promotion = Promotion::factory()->active()->create();
        $this->service->checkIsValidPromotion($promotion);
        $this->assertTrue(true);
    }

    // ═══════════════════════════════════════════════════════
    // assertPromotionApplicable
    // ═══════════════════════════════════════════════════════

    public function test_throws_when_eligible_items_empty(): void
    {
        $this->expectException(PromotionException::class);
        $this->expectExceptionMessage('No eligible items');

        $promotion = Promotion::factory()->active()->create();
        $this->service->assertPromotionApplicable($promotion, []);
    }

    public function test_throws_when_eligible_subtotal_below_minimum(): void
    {
        $this->expectException(PromotionException::class);
        $this->expectExceptionMessage('minimum amount');

        $promotion = Promotion::factory()->active()->withMinimumAmount(500)->create();
        $items     = $this->makeRawItems(2, 100); // 200 total

        $this->service->assertPromotionApplicable($promotion, $items);
    }

    public function test_throws_when_eligible_item_count_below_minimum(): void
    {
        $this->expectException(PromotionException::class);
        $this->expectExceptionMessage('enough items');

        $promotion = Promotion::factory()->active()->withMinimumItems(5)->create();
        $items     = $this->makeRawItems(2, 100);

        $this->service->assertPromotionApplicable($promotion, $items);
    }

    public function test_passes_when_all_conditions_met(): void
    {
        $promotion = Promotion::factory()->active()
            ->withMinimumAmount(100)
            ->withMinimumItems(2)
            ->create();

        $items = $this->makeRawItems(3, 100);

        $this->service->assertPromotionApplicable($promotion, $items);
        $this->assertTrue(true);
    }

    // ═══════════════════════════════════════════════════════
    // getBestPromotion
    // ═══════════════════════════════════════════════════════

    public function test_returns_null_when_no_promotions_exist(): void
    {
        $result = $this->service->getBestPromotion($this->makeRawItems(2, 100));

        $this->assertNull($result);
    }

    public function test_returns_null_when_all_promotions_expired(): void
    {
        Promotion::factory()->expired()->count(3)->create();

        $result = $this->service->getBestPromotion($this->makeRawItems(2, 100));

        $this->assertNull($result);
    }

    public function test_returns_promotion_with_highest_discount(): void
    {
        $low = Promotion::factory()->active()->percentage()->create([
            'value'                       => 10,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
        ]);

        $high = Promotion::factory()->active()->fixed()->create([
            'value'                       => 50,
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
            'minimum_order_amount'        => null,
            'minimum_items'               => null,
        ]);

        $result = $this->service->getBestPromotion($this->makeRawItems(2, 100));

        $this->assertNotNull($result);
        $this->assertEquals($high->id, $result['promotion_id']);
        $this->assertEquals(50.0, $result['discount']);
    }

    public function test_returns_null_when_no_promotions_qualify(): void
    {
        Promotion::factory()->active()->withMinimumAmount(9999)->create();

        $result = $this->service->getBestPromotion($this->makeRawItems(2, 100));

        $this->assertNull($result);
    }

    // ═══════════════════════════════════════════════════════
    // calculateDiscount
    // ═══════════════════════════════════════════════════════

    public function test_fixed_discount_returns_flat_value(): void
    {
        $promotion = Promotion::factory()->fixed()->create(['value' => 50]);

        $result = $this->service->calculateDiscount($promotion, 300.0);

        $this->assertEquals(50.0, $result);
    }

    public function test_percentage_discount_calculated_correctly(): void
    {
        $promotion = Promotion::factory()->percentage()->create(['value' => 25]);

        $result = $this->service->calculateDiscount($promotion, 200.0);

        $this->assertEquals(50.0, $result); // 25% of 200
    }

    // ═══════════════════════════════════════════════════════
    // updateOnOrderSuccess
    // ═══════════════════════════════════════════════════════

    public function test_increments_times_used(): void
    {
        $promotion = Promotion::factory()->active()->create([
            'times_used' => 0,
            'max_uses'   => 10,
        ]);

        $this->service->updateOnOrderSuccess($promotion->id);

        $this->assertEquals(1, $promotion->fresh()->times_used);
    }

    public function test_deactivates_promotion_when_max_uses_reached(): void
    {
        $promotion = Promotion::factory()->active()->create([
            'times_used' => 9,
            'max_uses'   => 10,
        ]);

        $this->service->updateOnOrderSuccess($promotion->id);

        $fresh = $promotion->fresh();
        $this->assertEquals(10, $fresh->times_used);
        $this->assertFalse((bool)$fresh->is_active);
    }

    public function test_does_not_deactivate_unlimited_promotion(): void
    {
        $promotion = Promotion::factory()->active()->unlimited()->create([
            'times_used' => 50,
        ]);

        $this->service->updateOnOrderSuccess($promotion->id);

        $this->assertTrue((bool)$promotion->fresh()->is_active);
        $this->assertEquals(51, $promotion->fresh()->times_used);
    }

    public function test_throws_when_promotion_not_found(): void
    {
        $this->expectException(PromotionException::class);

        $this->service->updateOnOrderSuccess('99999');
    }

    public function test_throws_when_promotion_already_exhausted(): void
    {
        $this->expectException(PromotionException::class);

        $promotion = Promotion::factory()->exhausted()->create();
        $this->service->updateOnOrderSuccess($promotion->id);
    }

    // ═══════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════

    private function makeRawItems(int $count, float $unitSubtotal): array
    {
        return array_map(fn($i) => [
            'quantity' => 1,
            'subtotal' => $unitSubtotal,
            'product'  => ['id' => $i, 'sub_categories' => [], 'nich_category' => []],
        ], range(1, $count));
    }
}