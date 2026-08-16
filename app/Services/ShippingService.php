<?php

namespace App\Services;

use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\ShippingException;
use App\Models\Promotion;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Repositories\ShippingRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class ShippingService
{
    /**
     * Create a new class instance.
     */
    public function __construct(private CartService $cartService , private ShippingRepository $shippingRepository)
    {
    }


    
   public function getZoneShippingInfo(string $city): ?ShippingZone
     {
          $record = ShippingZoneCity::with('shipping_zone')->where('city', $city)->first();
          return $record?->shipping_zone;
     }


    public function getShippingSettings(){
         return ShippingSetting::first();
    }



     private function checkFreeThresholdItems(array $items ,ShippingSetting $shipping_settings) : bool {


          if(count($items) >= $shipping_settings->free_shipping_threshold_items){
                    return true;
          }

          // check by cart items sub quantity if(iitems no exceeded the free threshold count)

          if($this->cartService->calculateCartSubQuantity($items) >= $shipping_settings->free_shipping_threshold_items) {
               return true;
          }

          return false ;

            
     }


     private function checkFreeThresholdAmount(array $items , ShippingSetting $shipping_settings) : bool {
        $items_subtotal = $this->cartService->calculateCartItemsSubtotal($items);
        return  $items_subtotal >= $shipping_settings->free_shipping_threshold_amount ;
     }

 
     private function checkFreeShippingByThreshold(array $items, ShippingSetting $settings): bool
     {
          
          $assertByAmount   = $settings->free_shipping_threshold_amount ?
                         $this->checkFreeThresholdAmount($items , $settings)
                         : false ;

          $assertByItems    = $settings->free_shipping_threshold_items ?
                              $this->checkFreeThresholdItems($items, $settings)
                              : false;
          
          return match($settings->free_shipping_type) {
               'amount' => $assertByAmount,
               'items'  => $assertByItems,
               'both'   => $assertByAmount && $assertByItems,
               'either' => $assertByAmount || $assertByItems,
               default  => false,
          };
     }
    
    
    public function calculateShipping(array $items ,string $cityName , ?int $promotion_id = null): float
    {  
               $city = $this->shippingRepository->getCity($cityName);
               
               if (!$city) {
                    throw new ShippingException("City '{$cityName}' is not supported.");
               }

               $zone = $city->shipping_zone()->first(['id' , 'price' , 'type' , 'is_active']);
               $settings = $this->getShippingSettings();
               
               $this->checkAvailableShippingInZone($zone);
               // if shipping is free initialy
               if($zone &&( $zone->price == 0)) {
                    return 0 ;
               }

               // if has free shiipping promotion
               if ($promotion_id) {
                    $promotion = Promotion::find($promotion_id);
                    if ($promotion && $promotion->type === 'free_shipping') {
                         return 0;
                    }
               }

               // shipping free in case some thresholds (amount / items count)
               if($this->checkFreeShippingByThreshold($items , $settings)){
                    return 0 ;
               }

               // if has fixed price no matter quantity
               if($zone->type === 'fixed'){
                    return $zone->price ;
               }

               return $this->calculateWeightBased($items, $zone , $settings);

    }



    private function calculateWeightBased(array $items, ShippingZone $zone, ShippingSetting $settings): float
     {
     $totalWeight = collect($items)->sum(function ($item) {
          $weight = ($item->product_variant->product->shipping['weight'] ?? 0);
          return $weight * $item->quantity;
     });

     if ($totalWeight <= $settings->base_weight_kg) {
          return $zone->price;
     }

     $extraWeight = $totalWeight - $settings->base_weight_kg;
     $extraPrice  = $extraWeight * $settings->extra_kg_price;

     return $zone->price + $extraPrice;
     }

    private function checkAvailableShippingInZone(?ShippingZone $zone): void
     {

          if (!$zone) {
               throw new ShippingException('Shipping is not configured for this region.');
          }

          if (!$zone->is_active) {
               throw new ShippingException('Shipping is currently unavailable for this region.' . $zone->is_active);
          }
     }


   public function avgShippingCost(){
       return (float) ShippingZone::where('is_active', true)->avg('price');
   }
}
