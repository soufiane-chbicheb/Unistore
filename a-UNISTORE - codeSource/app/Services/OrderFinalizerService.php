<?php

namespace App\Services;

use App\Models\Order;
use App\Services\Discount\CouponService;
use App\Services\Discount\PromotionService;
use Database\Seeders\PromotionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderFinalizerService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private CouponService $couponService,
        private PromotionService $promotionService
    )
    {
        //
    }

   

    public function finalize(Order $order){
        $needsCouponUpdate = $order->coupon_id && !$order->coupon_counted ;
        $needsPromotionUpdate = $order->promotion_id && !$order->promotion_counted ;
    
        if(!$needsCouponUpdate && !$needsPromotionUpdate) return ;
  
        DB::transaction(function () use ($order) {
                    $lockedOrder =  Order::lockForUpdate()->find($order->id);
                   
                    // coupon update
                    if($lockedOrder->coupon_id && !$lockedOrder->coupon_counted){
                        $this->couponService
                            ->updateCouponInOrderUsage($lockedOrder->coupon_id);
                        $lockedOrder->coupon_counted = true;
                    }
                
                     // promo update
                    if($lockedOrder->promotion_id && !$lockedOrder->promotion_counted){

                          $this->promotionService
                        ->updateOnOrderSuccess($lockedOrder->promotion_id);

                        $lockedOrder->promotion_counted = true;

                    }
                     
                    $lockedOrder->save();
        });
        
    }
}
