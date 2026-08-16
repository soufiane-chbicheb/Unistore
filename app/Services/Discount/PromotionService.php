<?php

namespace App\Services\Discount;

use App\Context\Order\CheckoutContext;
use App\Exceptions\PromotionException;
use App\Models\Promotion;
use App\Models\ShippingZone;
use App\Services\ShippingService;
use App\Services\StoreSettingService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Repositories\PromotionRepository;
use App\Services\CartService;

class PromotionService extends DiscountService
{
    private $store_currency;
    public function __construct(
        protected CartService $cartService,
        protected ShippingService $shippingService,
        private PromotionRepository $promotionRepository,
        private StoreSettingService $storeSettingsService
    ) {
        parent::__construct($cartService);
        $this->store_currency = $storeSettingsService->getStoreCurrency();
    }

    public function getAllPromotions()
    {
        return $this->promotionRepository->getAll();
    }

    public function getPromotionById(int $id)
    {
        return $this->promotionRepository->findById($id);
    }

    public function createPromotion(array $data)
    {
        return $this->promotionRepository->create($data);
    }

    public function updatePromotion(int $id, array $data)
    {
        return $this->promotionRepository->update($id, $data);
    }

    public function deletePromotion(int $id)
    {
        return $this->promotionRepository->delete($id);
    }

    public function getDbPromotions()
    {
        return Promotion::where('is_active', true)
            ->where(fn($q) => $q->whereNull('valid_from')->orWhere('valid_from', '<=', now()))
            ->where(fn($q) => $q->whereNull('valid_until')->orWhere('valid_until', '>=', now()))
            ->where(fn($q) => $q->whereNull('max_uses')->orWhereColumn('times_used', '<', 'max_uses'))
            ->get();
    }

    // mirrors checkIsValidCoupon — only global validity, no cart context needed
    public function checkIsValidPromotion(Promotion $promotion): void
    {
        if (!$this->checkUsageLimits($promotion)) {
            throw new PromotionException('This promotion has reached its maximum number of uses.');
        }

        if (!$this->checkValidityPeriod($promotion)) {
            throw new PromotionException('This promotion is not valid at this time.');
        }
    }

    // mirrors assertCouponApplicable — cart-level checks on eligible items only
    public function assertPromotionApplicable(Promotion $promotion, array $eligibleItems): void
    {
        if (empty($eligibleItems)) {
            throw new PromotionException('No eligible items found for this promotion.');
        }

        if (!$this->checkMinimumAmount($promotion, $eligibleItems)) {
            throw new PromotionException('Your order does not meet the minimum amount required for this promotion.');
        }

        if (!$this->checkMinimumItems($promotion, $eligibleItems)) {
            throw new PromotionException('Your order does not have enough items to apply this promotion.');
        }
    }

    public function getBestPromotion(array $items): array|null
    {
        $promotions = $this->getDbPromotions();
        $qualified = [];

        foreach ($promotions as $promotion) {
            try {
                // check global validity first
                $this->checkIsValidPromotion($promotion);

                //  filter eligible items — same as coupon flow
                $eligibility = $this->cartService->getCartEligibility($promotion, $items) ?? [];
                $eligibleItems = $eligibility['eligibleItems'] ?? [];

                //  check cart-level conditions on eligible items only
                $this->assertPromotionApplicable($promotion, $eligibleItems);

                // calculate discount on eligible subtotal only
                $eligibleSubtotal = $this->cartService->calculateCartItemsSubtotal($eligibleItems);
                $discount = $this->calculateDiscount($promotion, $eligibleSubtotal);

                $qualified[] = [
                    'promotion_id' => $promotion->id,
                    'discount' => $discount,
                ];
            } catch (Exception $e) {
                continue;
            }
        }

        if (empty($qualified))
            return null;

        return collect($qualified)->sortByDesc('discount')->first();
    }

    // same safe conditional update pattern as updateCouponInOrderUsage
    public function updateOnOrderSuccess(string $promotion_id): void
    {
        $promotion = Promotion::find($promotion_id);

        if (!$promotion) {
            throw new PromotionException("Promotion {$promotion_id} not found.");
        }

        $updated = Promotion::where('id', $promotion_id)
            ->where(fn($q) => $q->whereNull('max_uses')
                ->orWhereColumn('times_used', '<', 'max_uses'))
            ->update([
                'times_used' => DB::raw('times_used + 1'),
                'is_active' => DB::raw('CASE WHEN max_uses IS NOT NULL AND times_used + 1 >= max_uses THEN 0 ELSE 1 END'),
            ]);

        if ($updated === 0) {
            throw new PromotionException('Promotion no longer valid or has reached its usage limit.');
        }
    }



    public function getPromotionMillestones()
    {
        $promos = $this->promotionRepository->getPromotionsSetForAmount();
        $defaultShippingAmount = $this->shippingService->avgShippingCost();
        $items = $this->cartService->getCartItems();
        $cartTotal = $this->cartService->calculateCartItemsSubtotal($items ? $items->toArray() : []);
        $globalShippingSettings = $this->shippingService->getShippingSettings();

        return $promos
            ->filter(function($promo) use ($globalShippingSettings){ 
                if (!$globalShippingSettings) return true;
                
                return  ($promo->type === 'free_shipping' 
                        && $globalShippingSettings->free_shipping_threshold_amount > 0 
                        && $promo->minimum_order_amount > $globalShippingSettings->free_shipping_threshold_amount )? 
                        false :
                        true;
            })
            ->pipe(function($collection) { 
                //  handlee prevent duplicate iif we have  many free_shipping promotions bellow the global thresold 
                $freeShippings = $collection->filter(fn($p) => $p->type === 'free_shipping');
                
                if ($freeShippings->count() > 1) {
                    $best = $freeShippings->sortBy('minimum_order_amount')->first();
                    return $collection
                        ->filter(fn($p) => $p->type !== 'free_shipping')
                        ->push($best);
                }
                return $collection;
            })
            ->map(function ($promo) use ($defaultShippingAmount, $cartTotal) {
            $estimatedValue = 0;
            $message = '';
            $remaining = max(0, $promo->minimum_order_amount - $cartTotal);
            $clean_value = (float)$promo->value;
            $clean_max = (float)$promo->max_discount_amount;
            
            $discount_label = "get " . $clean_value . "% off";
            $cap_text = $clean_max > 0 ? " (up to " . $clean_max . " " . $this->store_currency . ")" : "";
            $discount_label .= $cap_text;

            if ($promo->type === 'percentage') {
                $leakedDiscount = $promo->minimum_order_amount * ($clean_value / 100);

                // Only cap if max_discount_amount is set and leakedDiscount exceeds it
                $estimatedValue = ($clean_max > 0 && $leakedDiscount > $clean_max)
                    ? $clean_max
                    : $leakedDiscount;

                $message = 'Add ' . (float)$remaining . " " . $this->store_currency . " and " . $discount_label;

            } elseif ($promo->type === 'free_shipping' ) {
                $estimatedValue = $defaultShippingAmount;
                $message = 'Add ' . (float)$remaining . " " . $this->store_currency . ' and get Free Shipping';
            }

            return [
                'max' => $clean_max,
                'goal' => (float) $promo->minimum_order_amount,
                'label' => ($promo->type === 'percentage' ? $clean_value . '%' : "FREE SHIPPING") . $cap_text,
                'percentage' => $clean_value ,
                'type' => $promo->type === 'free_shipping' ? 'free_shipping' : 'discount',
                'estimated_value' => (float) $estimatedValue,
                'message' => $message,
                'discount_label' => $discount_label
            ];
        });

    }
}