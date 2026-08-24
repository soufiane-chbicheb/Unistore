<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Models\StoreSetting;
use App\Services\Discount\PromotionService;
use App\Services\ShippingService;
use App\Services\StoreSettingService;
use Illuminate\Http\Request;

class ShippingController extends Controller
{

    public function __construct(
        private ShippingService $shippingService
    ){ 
       

     }


    public function calculate(string $name, Request $request, ShippingService $shippingService) {
          $cityRecord = ShippingZoneCity::where('city' , $name)
            ->whereHas('shipping_zone') // Ensure it belongs to current store
            ->firstOrFail();
          // Fallback to empty items if not provided
          $items = $request->input('items', []);
          $promotionId = $request->input('promotionId');

          try {
              $cost = $shippingService->calculateShipping($items, $cityRecord->city, $promotionId);
              $zone = $cityRecord->shipping_zone()->first(['estimated_days', 'price']);
              
              return response()->json([
                  'cost' => $cost,
                  'zone' => $zone,
                  'city' => $cityRecord->city
              ], 200);
          } catch (\Exception $e) {
              return response()->json(['error' => $e->getMessage()], 422);
          }
    }

  
    public function getCities() {
        // Query through ShippingZone to respect the BelongsToStore global scope
        $cities =  ShippingZoneCity::whereHas('shipping_zone')->get(['id' , 'city']);

        return response()->json(['cities'=> $cities],200) ;
    }
}
