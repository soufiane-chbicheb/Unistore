<?php

namespace Tests\Factories;

use App\Context\Order\CheckoutContext;
use App\DTOs\Order\CreateOrderDTO;
use App\DTOs\Order\OrderAddressDTO;
use App\DTOs\Order\OrderItemDTO;
use App\Models\Coupon;
use App\Models\User;

class CheckoutContextFactory
{
    // ── Standard factory ──────────────────────────────────
    public static function make(
        ?User $user = null,
        int $itemCount = 2,
        ?Coupon $coupon = null,
    ): CheckoutContext {
        $dto = self::makeDTO(
            user:      $user,
            itemCount: $itemCount,
            coupon:    $coupon,
            couponId:  $coupon?->id,
        );

        return new CheckoutContext($dto, $user);
    }

    // ── Factory with explicit coupon_id (for non-existent coupon tests) ──
    public static function makeWithCouponId(
        ?User $user = null,
        int $itemCount = 2,
        int $couponId = 99999,
    ): CheckoutContext {
        $dto = self::makeDTO(
            user:      $user,
            itemCount: $itemCount,
            coupon:    null,
            couponId:  $couponId, // ← injected directly, no Coupon model needed
        );

        return new CheckoutContext($dto, $user);
    }

    // ── Build DTO ─────────────────────────────────────────
    private static function makeDTO(
        ?User $user,
        int $itemCount,
        ?Coupon $coupon,
        ?int $couponId,
    ): CreateOrderDTO {
        return new CreateOrderDTO(
            order_number:      null,
            payment_method_id: null,
            user_id:           $user?->id,
            tracking_token:    null,
            notes:             null,
            payment_method:    'cod',
            items:             self::makeItems($itemCount),
            address:           self::makeAddress(),
            coupon_code:       $coupon?->code,
            paid_at:           null,
            tax:               0,
            total_amount:      0,
            discount_amount:   0,
            shipping_cost:     0,
            coupon_id:         $couponId,
            promotion_id :         null,
            promotion_counted : false ,
            coupon_counted : false ,
            payment_status : 'pending' ,
            order_status : 'pending'
        );
    }

    // ── Build items ───────────────────────────────────────
    private static function makeItems(int $count): array
    {
        return array_map(function ($i) {
            $product = \App\Models\Product::factory()->create();
            $variant = \App\Models\ProductVariant::factory()
                            ->for($product)
                            ->create();

            $variantArray            = $variant->toArray();
            $variantArray['product'] = $product->toArray();

            return new OrderItemDTO(
                product_variant_id: $variant->id,
                quantity:           2,
                price_snapshot:     100.00,
                subtotal:           200.00,
                product_name:       $product->name,
                product_variant:    $variantArray,
                product:            $product->toArray(),
            );
        }, range(1, $count));
    }

    // ── Build address ─────────────────────────────────────
    private static function makeAddress(): OrderAddressDTO
    {
        return new OrderAddressDTO(
            first_name:    'John',
            last_name:     'Doe',
            address_line1: '123 Test Street',
            address_line2: null,
            city:          'Casablanca',
            phone:         '0612345678',
            email:         'john@example.com',
        );
    }
}