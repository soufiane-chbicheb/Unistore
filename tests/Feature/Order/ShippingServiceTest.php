<?php

namespace Tests\Unit\Services;

use App\Exceptions\ShippingException;
use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Services\CartService;
use App\Services\ShippingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class ShippingServiceTest extends TestCase
{
    use RefreshDatabase;

    private ShippingService $shippingService;
    private $cartService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cartService = Mockery::mock(CartService::class);
        $this->shippingService = new ShippingService($this->cartService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    // ========================================================
    // Helpers
    // ========================================================

    private function makeZone(array $attrs = []): ShippingZone
    {
        return ShippingZone::factory()->create(array_merge([
            'price'     => 10.0,
            'type'      => 'fixed',
            'is_active' => true,
        ], $attrs));
    }

    private function makeCity(ShippingZone $zone, string $city = 'Casablanca'): void
    {
        ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone->id,
        ]);
    }

    private function makeSettings(array $attrs = []): ShippingSetting
    {
        return ShippingSetting::factory()->create(array_merge([
            'free_shipping_threshold_amount' => 100.0,
            'free_shipping_threshold_items'  => 10,
            'free_shipping_type'             => 'amount',
            'base_weight_kg'                 => 5.0,
            'extra_kg_price'                 => 2.0,
        ], $attrs));
    }

    // matches $item->product_variant->product->shipping->weight and $item->quantity
    private function makeItems(int $count = 2, float $weight = 2.0, int $qty = 1): array
    {
        $items = [];
        for ($i = 0; $i < $count; $i++) {
            $items[] = (object)[
                'quantity'        => $qty,
                'product_variant' => (object)[
                    'product' => (object)[
                        'shipping' => (object)['weight' => $weight]
                    ]
                ]
            ];
        }
        return $items;
    }

    // helper — mock both cart methods since checkFreeShippingByThreshold always calls both
    private function mockCartBoth(float $subtotal, int $subQty): void
    {
        $this->cartService->shouldReceive('calculateCartItemsSubtotal')->once()->andReturn($subtotal);
        $this->cartService->shouldReceive('calculateCartSubQuantity')->once()->andReturn($subQty);
    }

    // ========================================================
    // getZoneShippingInfo
    // ========================================================

    /** @test */
    public function it_returns_shipping_zone_for_known_city(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone, 'Rabat');

        $result = $this->shippingService->getZoneShippingInfo('Rabat');

        $this->assertInstanceOf(ShippingZone::class, $result);
        $this->assertEquals($zone->id, $result->id);
    }

    /** @test */
    public function it_returns_null_for_unknown_city(): void
    {
        $result = $this->shippingService->getZoneShippingInfo('NowhereCity');
        $this->assertNull($result);
    }

    // ========================================================
    // checkAvailableShippingInZone
    // ========================================================

    /** @test */
    public function it_throws_if_no_zone_found_for_city(): void
    {
        $this->makeSettings();

        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('Shipping is not configured for this region.');

        $this->shippingService->calculateShipping($this->makeItems(), 'UnknownCity');
    }

    /** @test */
    public function it_throws_if_zone_is_inactive(): void
    {
        $zone = $this->makeZone(['is_active' => false]);
        $this->makeCity($zone);
        $this->makeSettings();

        $this->expectException(ShippingException::class);
        $this->expectExceptionMessage('Shipping is currently unavailable for this region.');

        $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca');
    }

    // ========================================================
    // zone price = 0 — returns before threshold checks
    // no cart mocks needed — returns early
    // ========================================================

    /** @test */
    public function it_returns_zero_if_zone_price_is_zero(): void
    {
        $zone = $this->makeZone(['price' => 0]);
        $this->makeCity($zone);
        $this->makeSettings();

        // no cart mocks — returns before threshold checks
        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    // ========================================================
    // free shipping promotion
    // returns before threshold checks — only subtotal mock needed
    // ========================================================

    /** @test */
    public function it_returns_zero_for_free_shipping_promotion(): void
    {
        $zone = $this->makeZone(['price' => 15]);
        $this->makeCity($zone);
        // set threshold very high so it won't trigger free shipping
        $this->makeSettings(['free_shipping_threshold_amount' => 999]);

        $promotion = Promotion::factory()->create(['type' => 'free_shipping']);

        // returns before threshold checks — no cart mocks needed
        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca', $promotion->id);

        $this->assertEquals(0.0, $result);
    }

    /** @test */
    public function it_does_not_apply_free_shipping_for_non_free_shipping_promotion(): void
    {
        $zone = $this->makeZone(['price' => 10, 'type' => 'fixed']);
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 999,
            'free_shipping_threshold_items'  => 999,
        ]);

        $promotion = Promotion::factory()->create(['type' => 'percentage']);

        // threshold checks run — both mocks needed
        // count($items)=2 < 999 → calculateCartSubQuantity also called
        $this->mockCartBoth(10, 1);

        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca', $promotion->id);

        $this->assertEquals(10.0, $result);
    }

    // ========================================================
    // threshold type: amount
    // both checkFreeThresholdAmount AND checkFreeThresholdItems always called
    // count($items)=2 < threshold_items=10 → calculateCartSubQuantity called
    // ========================================================

    /** @test */
    public function it_returns_zero_when_subtotal_meets_amount_threshold(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 100,
            'free_shipping_threshold_items'  => 10,
        ]);

        // subtotal 100 >= threshold 100 → free
        // count(2) < 10 → calculateCartSubQuantity called
        $this->mockCartBoth(100, 1);

        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    /** @test */
    public function it_charges_shipping_when_subtotal_below_amount_threshold(): void
    {
        $zone = $this->makeZone(['type' => 'fixed', 'price' => 10]);
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 100,
            'free_shipping_threshold_items'  => 10,
        ]);

        // subtotal 50 < threshold 100 → not free
        // count(2) < 10 → calculateCartSubQuantity called
        $this->mockCartBoth(50, 1);

        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca');

        $this->assertEquals(10.0, $result);
    }

    // ========================================================
    // threshold type: items
    // checkFreeThresholdItems: count($items) checked first
    // if count >= threshold → returns true, no calculateCartSubQuantity
    // if count < threshold → calculateCartSubQuantity called
    // ========================================================

    /** @test */
    public function it_returns_zero_when_item_count_meets_items_threshold(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'            => 'items',
            'free_shipping_threshold_items' => 3,
            'free_shipping_threshold_amount' => null, // disabled
        ]);

        // count(3) >= 3 → free, calculateCartSubQuantity NOT called
        // threshold_amount is null → checkFreeThresholdAmount skipped → calculateCartItemsSubtotal NOT called
        $items = $this->makeItems(3);

        $result = $this->shippingService->calculateShipping($items, 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    /** @test */
    public function it_returns_zero_when_sub_quantity_meets_items_threshold(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'items',
            'free_shipping_threshold_items'  => 5,
            'free_shipping_threshold_amount' => null, // disabled
        ]);

        // count(2) < 5 → calculateCartSubQuantity called → returns 5 → free
        // threshold_amount null → calculateCartItemsSubtotal NOT called
        $items = $this->makeItems(2);

        $this->cartService->shouldReceive('calculateCartSubQuantity')->once()->andReturn(5);

        $result = $this->shippingService->calculateShipping($items, 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    // ========================================================
    // threshold type: both
    // ========================================================

    /** @test */
    public function it_returns_zero_when_both_thresholds_met(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'both',
            'free_shipping_threshold_amount' => 100,
            'free_shipping_threshold_items'  => 3,
        ]);

        // count(3) >= 3 → items met, calculateCartSubQuantity NOT called
        // subtotal 100 >= 100 → amount met
        $items = $this->makeItems(3);

        $this->cartService->shouldReceive('calculateCartItemsSubtotal')->once()->andReturn(100);

        $result = $this->shippingService->calculateShipping($items, 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    /** @test */
    public function it_charges_shipping_when_only_amount_met_with_both_type(): void
    {
        $zone = $this->makeZone(['type' => 'fixed', 'price' => 10]);
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'both',
            'free_shipping_threshold_amount' => 100,
            'free_shipping_threshold_items'  => 10,
        ]);

        // amount met, but count(2) < 10 and subQty(2) < 10 → items not met → not free
        $this->mockCartBoth(100, 2);

        $result = $this->shippingService->calculateShipping($this->makeItems(2), 'Casablanca');

        $this->assertEquals(10.0, $result);
    }

    // ========================================================
    // threshold type: either
    // ========================================================

    /** @test */
    public function it_returns_zero_when_only_amount_met_with_either_type(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'either',
            'free_shipping_threshold_amount' => 100,
            'free_shipping_threshold_items'  => 10,
        ]);

        // amount met → free (either needs only one)
        // count(2) < 10 → calculateCartSubQuantity called
        $this->mockCartBoth(100, 2);

        $result = $this->shippingService->calculateShipping($this->makeItems(2), 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    /** @test */
    public function it_returns_zero_when_only_items_met_with_either_type(): void
    {
        $zone = $this->makeZone();
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_type'             => 'either',
            'free_shipping_threshold_amount' => 999,
            'free_shipping_threshold_items'  => 3,
        ]);

        // count(3) >= 3 → items met → free (either needs only one)
        // amount not met (10 < 999) → calculateCartItemsSubtotal called
        $items = $this->makeItems(3);

        $this->cartService->shouldReceive('calculateCartItemsSubtotal')->once()->andReturn(10);

        $result = $this->shippingService->calculateShipping($items, 'Casablanca');

        $this->assertEquals(0.0, $result);
    }

    // ========================================================
    // fixed zone price
    // ========================================================

    /** @test */
    public function it_returns_fixed_zone_price_when_threshold_not_met(): void
    {
        $zone = $this->makeZone(['type' => 'fixed', 'price' => 15.0]);
        $this->makeCity($zone);
        $this->makeSettings([
            'free_shipping_threshold_amount' => 999,
            'free_shipping_threshold_items'  => 999,
        ]);

        // count(2) < 999 → calculateCartSubQuantity called
        $this->mockCartBoth(10, 1);

        $result = $this->shippingService->calculateShipping($this->makeItems(), 'Casablanca');

        $this->assertEquals(15.0, $result);
    }


    // extra weight tests
    // ========================================================
// calculateWeightBased — type = 'calculated'
// weight = item->product_variant->product->shipping->weight * item->quantity
// if totalWeight <= base_weight_kg → return zone->price
// if totalWeight > base_weight_kg → return zone->price + (extraWeight * extra_kg_price)
// ========================================================

/** @test */
public function it_returns_base_price_when_total_weight_within_base(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // 2 items × 2kg × qty 1 = 4kg — within base of 5kg
    $items = $this->makeItems(2, 2.0, 1);

    // count(2) < 999 → calculateCartSubQuantity called
    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(10.0, $result); // just base price
}

/** @test */
public function it_returns_base_price_when_total_weight_exactly_equals_base(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 4.0, // exactly matches total weight
        'extra_kg_price'                 => 2.0,
    ]);

    // 2 items × 2kg × qty 1 = 4kg = base_weight_kg → no extra
    $items = $this->makeItems(2, 2.0, 1);

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(10.0, $result); // exactly at base — no extra charge
}

/** @test */
public function it_adds_extra_charge_when_weight_exceeds_base(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // 4 items × 2kg × qty 1 = 8kg — 3kg over base → extra = 3 × 2 = 6
    $items = $this->makeItems(4, 2.0, 1);

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(16.0, $result); // 10 base + 6 extra
}

/** @test */
public function it_accounts_for_item_quantity_in_weight_calculation(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // 1 item × 2kg × qty 3 = 6kg — 1kg over base → extra = 1 × 2 = 2
    $items = $this->makeItems(1, 2.0, 3);

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(12.0, $result); // 10 base + 2 extra
}

/** @test */
public function it_handles_item_with_no_shipping_weight(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // items with null shipping weight — defaults to 0
    $items = [
        (object)[
            'quantity'        => 2,
            'product_variant' => (object)[
                'product' => (object)[
                    'shipping' => null // no shipping config
                ]
            ]
        ]
    ];

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(10.0, $result); // weight = 0, within base → just base price
} 


/** @test */
public function it_handles_item_with_null_shipping_weight(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // weight is null → defaults to 0 via ?? 0
    // totalWeight = 0 → within base of 5 → just base price
    $items = [
        (object)[
            'quantity'        => 2,
            'product_variant' => (object)[
                'product' => (object)[
                    'shipping' => (object)['weight' => null] // ← null weight
                ]
            ]
        ]
    ];

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(10.0, $result); // 0kg weight → within base → just zone price
}

/** @test */
public function it_handles_mixed_items_some_with_null_weight(): void
{
    $zone = $this->makeZone(['type' => 'calculated', 'price' => 10.0]);
    $this->makeCity($zone);
    $this->makeSettings([
        'free_shipping_threshold_amount' => 999,
        'free_shipping_threshold_items'  => 999,
        'base_weight_kg'                 => 5.0,
        'extra_kg_price'                 => 2.0,
    ]);

    // item 1 → weight null → 0kg
    // item 2 → weight 3kg × qty 2 = 6kg
    // total = 6kg → 1kg over base → extra = 1 × 2 = 2
    $items = [
        (object)[
            'quantity'        => 2,
            'product_variant' => (object)[
                'product' => (object)[
                    'shipping' => (object)['weight' => null] // contributes 0
                ]
            ]
        ],
        (object)[
            'quantity'        => 2,
            'product_variant' => (object)[
                'product' => (object)[
                    'shipping' => (object)['weight' => 3.0] // contributes 6kg
                ]
            ]
        ],
    ];

    $this->mockCartBoth(10, 1);

    $result = $this->shippingService->calculateShipping($items, 'Casablanca');

    $this->assertEquals(12.0, $result); // 10 base + 2 extra
}

}