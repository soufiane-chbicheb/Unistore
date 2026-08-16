<?php

namespace App\Services\Discount;

use App\Context\Order\CheckoutContext;
use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\CouponException;
use App\Exceptions\DiscountException;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use App\Services\CartService;
use Error;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

abstract class DiscountService
{
    /**
     * Create a new class instance.
     */
        public function __construct(protected CartService $cartService)
        {
        }
 
    
        
        protected function checkMinimumAmount(Coupon | Promotion $discount , array $items) : bool {
            // 'minimum_order_amount' // Min 200 MAD to use coupon
            $cartSubtotal = $this->cartService->calculateCartItemsSubtotal($items);
            return   $cartSubtotal >= $discount->minimum_order_amount ;
        }

        protected function checkMinimumItems(Coupon | Promotion $discount , array $items) : bool{
            //  'minimum_items' // Min 2 items required
            if(count($items) >=  $discount->minimum_items){
                  return true ;
            }else {
                  
                  $sub_quantity = (int) $this->cartService->calculateCartSubQuantity($items);

                  return $sub_quantity >= $discount->minimum_items;
            }
        }

        protected function checkUsageLimits(Coupon | Promotion $discount) : bool {
            //     'max_uses' // Total times coupon can be used (null = unlimited)
            //     'times_used' // Track how many times it's been used
            return is_null($discount->max_uses) || $discount->times_used < $discount->max_uses;

        }

        
        protected function checkValidityPeriod(Coupon | Promotion $discount) : bool {
           return (is_null($discount->valid_from) || $discount->valid_from <= now()) &&
                   (is_null($discount->valid_until) || $discount->valid_until >= now());

        }
       
      

         public function calculateDiscount(Coupon | Promotion $discounted , float $eligibleTotal): float {
            $discount = 0;
            if ($discounted->type === 'fixed') {
                $discount = (float)$discounted->value;
            } elseif ($discounted->type === 'percentage') {
                $discount = ($discounted->value / 100) * $eligibleTotal;
            }

            // Apply max_discount_amount cap if it exists
            if (isset($discounted->max_discount_amount) && $discounted->max_discount_amount > 0) {
                $discount = min($discount, (float)$discounted->max_discount_amount);
            }

            return $discount;
        }

}
