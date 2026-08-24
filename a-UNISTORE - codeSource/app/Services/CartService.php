<?php

namespace App\Services;

use App\DTOs\Order\OrderItemDTO;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Promotion;
use App\Models\User;
use App\Services\Discount\CouponService;
use App\Services\Discount\DiscountService;
use App\Services\Discount\ItemEligibilityService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartService
{
    public function __construct(private ItemEligibilityService $itemEligibilityService){}

    public function addToCart(array $data)
    {
        $userId = Auth::id();
        if (!$userId) {
            Log::error('CartService: User not authenticated');
            throw new Exception("Please login to add items to your cart.");
        }
        
        Log::info('CartService: Adding to cart', ['data' => $data, 'user_id' => $userId]);

        $variant = \App\Models\ProductVariant::findOrFail($data['variant_id']);

        $cartItem = Cart::where('product_variant_id', $data['variant_id'])
            ->where('user_id', $userId)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $data['quantity'] ?? 1);
            Log::info('CartService: Incremented quantity', ['cart_item_id' => $cartItem->id]);
        } else {
            $cartItem = Cart::create([
                'user_id' => $userId,
                'product_variant_id' => $data['variant_id'],
                'quantity' => $data['quantity'] ?? 1,
                'price_snapshot' => $variant->price,
            ]);
            Log::info('CartService: Created new cart item', ['cart_item_id' => $cartItem->id]);
        }
    }

    public function clearCart()
    {
        $userId = Auth::id();
        Cart::where('user_id', $userId)->delete();
    }

    public function getCartItems($withCategories = false){

        try{

        $userId = Auth::id();
        
        return Cart::query()
            ->where('user_id', $userId)
            ->with(['productVariant' => function($q) use($withCategories) {
                    $q->select('id', 'product_id', 'attrs', 'stock', 'price', 'sku');
                    $q->with(['product' => function($q2) use($withCategories){
                        $q2->select('id', 'name', 'description');
                        $q2->with('thumbnail') ;
                        $q2->when($withCategories, function($q3){
                               $q3->with('subCategories', 'nichCategory') ;
                        });
                    }]);
            }])
        
            ->get();
 
        }
        catch(Exception $e){
             Log::error('querying cart items Error :'. $e->getMessage());
             return collect([]) ;
        }
    }


    public function calculateCartSubQuantity(array $items){

        return  (int) collect($items)->sum(function ($item) {
                 if (is_array($item)) {
                      return $item['quantity'];
                 }
                return $item->quantity;
      });
    }

    public  function calculateCartItemsSubtotal(array $items){
            return  (int) collect($items)->sum(function ($item) {
                        if (is_array($item)) {
                            return $item['subtotal'];
                        }
                        return $item->subtotal;
                     });
    }

    public function getCartEligibility(Coupon | Promotion $discount , array $items){
           $eligibility = [] ;
           foreach($items as $item){
                try{
                $itemArray = $item instanceof OrderItemDTO
                ? $item->toArray()
                : $item;

                  $this->itemEligibilityService->assertApplicabilityForItem($discount ,$itemArray);
                  $eligibility['eligibleItems'][]  = $itemArray;

                }catch(Exception $e){
                    $eligibility['ineligibleItems'][] = $itemArray;
                }
           }

           return $eligibility;
    }

    // public function clearCart(?User $user): void
    // {
    //     Cart::where('user_id', $user->id)->delete();
    // }
}