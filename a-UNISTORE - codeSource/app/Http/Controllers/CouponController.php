<?php

namespace App\Http\Controllers;

use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Services\CartService;
use App\Services\Discount\CouponService ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function __construct(private CouponService $couponService , private CartService $cartService)
    {
    }
    

     public function getAll()
    {
        $coupons = $this->couponService->getDbCoupons() ;
        return response()->json($coupons);
    }

    public function coupon_feedback(Request $request){
            
            $validated = $request->validate([
                'coupon_code' => 'required|string'
            ]);

            $coupon = Coupon::where('code', $validated['coupon_code'])->first();
 
         
            if(!$coupon){
                  return response()->json(['error' => 'coupon not registred '], 422);
            }
         
            $items = $this->cartService->getCartItems(true)->toArray();

            if(empty($items)){
                 return response()->json(['error' => 'you cart is empty try to add some items '] , 422);
            }

            $user = Auth::user();

            try {
                $this->couponService->checkIsValidCoupon($coupon, $user);
                $this->couponService->assertCouponApplicable($coupon, $items);
                return response()->json(['success'=> 'teh coupon is succeesfully applyied'],200);
            } catch (CouponException $e) {
                return response()->json(['error' => $e->getMessage()], 422);
            }

    }
}
