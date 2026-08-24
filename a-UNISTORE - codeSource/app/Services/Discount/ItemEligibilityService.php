<?php

namespace App\Services\Discount;

use App\Exceptions\DiscountException;
use App\Models\Coupon;
use App\Models\Promotion;

class ItemEligibilityService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


     private function assertInProductIds(array $item , array $applicableIds) : bool {
           return in_array($item['product']["id"], $applicableIds);
        }

        private function assertInCategotiesIds(array $item , array $applicableIds) : bool {
           $productCategories = collect($item['product']['sub_categories'])->merge($item['product']['nich_category'])->pluck('id')->toArray();
           return count(array_intersect($productCategories, $applicableIds)) > 0;
        }

        /**
         * @throws DiscountException
         */
        public function assertApplicabilityForItem(Coupon | Promotion $discount , array $item) {
                // Promotions no longer have product/category targeting
                if ($discount instanceof Promotion) {
                    return;
                }

                $applicableProductsIds = $discount->applicable_product_ids ?? [] ;
                $applicableCategoriesIds = collect($discount->applicable_category_ids ?? [])
                                           ->merge($discount->applicable_sub_category_ids ?? [])->toArray();
                
                // no prroducts ids or categoey ids specified = all are qualified fo the discount
                if(empty($applicableProductsIds) &&
                   empty($applicableCategoriesIds)
                ) return ;

                if(!empty($applicableProductsIds) &&
                 $this->assertInProductIds($item , $applicableProductsIds
                 )){
                     return ;
                 }

                if(!empty($applicableCategoriesIds) &&
                 $this->assertInCategotiesIds($item , $applicableCategoriesIds
                 )){
                    return  ;
                }

                throw new DiscountException('this item not qualified for this discount') ;
        }



    
}
