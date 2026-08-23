<?php

namespace Tests\Unit\Services\Discount;

use App\Exceptions\DiscountException;
use App\Models\Coupon;
use App\Services\Discount\ItemEligibilityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemEligibilityServiceTest extends TestCase
{
    use RefreshDatabase;

    private ItemEligibilityService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ItemEligibilityService::class);
    }

    public function test_passes_when_product_id_matches(): void
    {
        $coupon = Coupon::factory()->active()->forProducts([42])->create();

        $item = $this->makeItem(42);

        $this->service->assertApplicabilityForItem($coupon, $item);
        $this->assertTrue(true);
    }

    public function test_passes_when_category_matches(): void
    {
        $coupon = Coupon::factory()->active()->forCategories([10])->create();

        $item = $this->makeItem(99, categoryIds: [10]);

        $this->service->assertApplicabilityForItem($coupon, $item);
        $this->assertTrue(true);
    }

    public function test_passes_when_sub_category_matches(): void
    {
        $coupon = Coupon::factory()->active()->forSubCategories([55])->create();

        $item = $this->makeItem(99, subCategoryIds: [55]);

        $this->service->assertApplicabilityForItem($coupon, $item);
        $this->assertTrue(true);
    }

    public function test_throws_when_product_and_category_both_miss(): void
    {
        $this->expectException(DiscountException::class);

        $coupon = Coupon::factory()->active()->forProducts([1])->create();

        $item = $this->makeItem(999); // wrong product, no matching category

        $this->service->assertApplicabilityForItem($coupon, $item);
    }

    public function test_throws_when_applicable_ids_all_null(): void
    {
       
        $coupon = Coupon::factory()->active()->create([
            'applicable_product_ids'      => null,
            'applicable_category_ids'     => null,
            'applicable_sub_category_ids' => null,
        ]);

        $item = $this->makeItem(1);

        $this->service->assertApplicabilityForItem($coupon, $item);
          $this->assertTrue(true);
    }

    // ─── helpers ────────────────────────────────────────────

    private function makeItem(
        int $productId,
        array $categoryIds = [],
        array $subCategoryIds = [],
    ): array {
        return [
            'quantity' => 1,
            'subtotal' => 100,
            'product'  => [
                'id'             => $productId,
                'sub_categories' => array_map(fn($id) => ['id' => $id], $subCategoryIds),
                'nich_category'  => array_map(fn($id) => ['id' => $id], $categoryIds),
            ],
        ];
    }
}