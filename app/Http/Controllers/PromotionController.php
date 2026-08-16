<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Services\CartService;
use App\Services\Discount\PromotionService;
use App\Services\ShippingService;
use App\Services\StoreSettingService;
use Illuminate\Http\Request;

class PromotionController extends Controller
{


    private $store_currency ;


    public function __construct(
        private PromotionService $promotionService ,
        private CartService $cartService, 
        private StoreSettingService $storeSettingsService  , 
        private ShippingService $shippingService
        )
    {
        $this->store_currency = $storeSettingsService->getStoreCurrency();

    }
      public function getAll()
    {
        $promotions = $this->promotionService->getDbPromotions();
      
        $transformed = $promotions->map(function($promo) {
            return [
                'id' => $promo->id,
                'name' => $promo->name,
                'discount' => $promo->type === 'percentage' ? "{$promo->value}%" : "FREE",
                'expiry' => $promo->valid_until ? $promo->valid_until->format('Y-m-d') : null,
            ];
        });

        return response()->json($transformed);
    }


      public function calculateBestRewardForUser($tenant)
    {
        $items = $this->cartService->getCartItems();
        if (!$items) {
             return response()->json([
                'nextMilestone' => null,
                'currentMilestone' => null,
                'milestones' => []
            ], 200);
        }

        $cartTotal = $this->cartService->calculateCartItemsSubtotal($items->toArray());
        
        if ($cartTotal == 0) {
            return response()->json([
                'nextMilestone' => null,
                'currentMilestone' => null,
                'milestones' => []
            ], 200);
        }

        // 1. Prepare raw milestones (including free shipping if applicable)
        $globalShipping = ShippingSetting::where('free_shipping_type' , 'amount')->first();
        $milestones = $this->promotionService->getPromotionMillestones() ?? collect([]);
        
        if ($globalShipping 
            && (float)$globalShipping->free_shipping_threshold_amount > 0
            && !$milestones->contains(fn($m) => ($m['type'] ?? '')  === 'free_shipping')
            ) {
            $goal = (float) $globalShipping->free_shipping_threshold_amount ;
            $remaining = max(0, $goal - $cartTotal) ;
            $milestones->push([
                'goal' => $goal,
                'label' => 'FREE SHIPPING',
                'percentage' => null ,
                'type' => 'free_shipping',
                'estimated_value' => (float) $this->shippingService->avgShippingCost(),
                'message' => "Add " . number_format($remaining, 2) . " " .$this->store_currency  ." and get a Free Shipping " 
            ]);
        }

        // 2. Process milestones: Group by goal (keep best reward per goal) and sort
        $sortedMilestones = $milestones
                            ->filter(fn($m) => isset($m['goal']))
                            ->groupBy('goal')
                            ->map(fn($group) => $group->sortByDesc("estimated_value")->first())
                            ->sortBy('goal')
                            ->values();

        // 3. Strictly Upward: Filter out any higher-goal milestone that offers a worse reward
        $finalMilestones = collect();
        $currentMaxValue = -1;

        foreach ($sortedMilestones as $m) {
            if (($m['estimated_value'] ?? 0) >= $currentMaxValue) {
                $finalMilestones->push($m);
                $currentMaxValue = $m['estimated_value'] ?? 0;
            }
        }

        // 4. Calculate current reached and next milestone
        $currReachedMilestone = $finalMilestones->filter(fn($m) => $cartTotal >= $m['goal'])->last();
        $nextMilestone = $finalMilestones->filter(fn($m) => $cartTotal < $m['goal'])->first();

        return response()->json([
            'currentMilestone' => $currReachedMilestone,
            'nextMilestone' => $nextMilestone,
            'milestones' => $finalMilestones
        ], 200);
    }




    public function validateScalling(){ // befreo store or update validation the scalling
    // Higher goal => Higher estimated reward.
    // Lower goal => Lower estimated reward.
    }

}
