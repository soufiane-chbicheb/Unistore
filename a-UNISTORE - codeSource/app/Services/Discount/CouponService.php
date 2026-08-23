<?php

namespace App\Services\Discount;

use App\Context\Order\CheckoutContext;
use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\CouponException;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Error;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

 use App\Repositories\CouponRepository;

class CouponService extends DiscountService
{
    public function __construct(
        protected CartService $cartService,
        private CouponRepository $couponRepository
    ) {
        parent::__construct($cartService);
    }

    public function getAllCoupons()
    {
        return $this->couponRepository->getAll();
    }

    public function getCouponById(int $id)
    {
        return $this->couponRepository->findById($id);
    }

    public function createCoupon(array $data)
    {
        return $this->couponRepository->create($data);
    }

    public function updateCoupon(int $id, array $data)
    {
        return $this->couponRepository->update($id, $data);
    }

    public function deleteCoupon(int $id)
    {
        return $this->couponRepository->delete($id);
    }
   
        public function getDbActiveCoupons(){
            return Coupon::where('is_active', true)
            ->whereNull('valid_until')
            ->orWhere('valid_until', '>', now())
            ->get();
        }

        public function getDbCoupons(){
            return $this->getDbActiveCoupons();
        }

        public function getDbCouponCodeMatch(string $coupon_code){
                 return Coupon::where('code' , $coupon_code)
                     ->where('is_active' , true)
                     ->first();

        }

        private function checkUsagePerUser(Coupon $coupon , User $user) :bool{
            //     'max_uses_per_user' // How many times ONE user can use it
            $countUsage = Order::where('user_id', $user->id)
                          ->where('coupon_id' , $coupon->id)
                          ->where('order_status' , ['delivered', 'pending' , 'confirmed'])
                          ->count();

            return $coupon->max_uses_per_user > $countUsage ;
        }

        public function checkIsValidCoupon(
        Coupon $coupon,
        ?User $user
        ): void {


               if (!$user) {
                    throw new CouponException('This coupon requires an account. Please login or register to use it.');
                }
              

                if (!$this->checkUsagePerUser($coupon, $user)) {
                    throw new CouponException('You have already reached the maximum number of uses for this coupon.');
                }


                if (!$this->checkUsageLimits($coupon)) {
                    throw new CouponException('This coupon has reached its maximum of use ');
                }


                if (!$this->checkValidityPeriod($coupon)) {
                    throw new CouponException('This coupon is not valid at this time.');
                }


         }


        public function assertCouponApplicable(
            Coupon $coupon,
             array $items
             
             ):void {

                  if (!$this->checkMinimumAmount($coupon, $items)) {
                    throw new CouponException(
                        'Your order does not meet the minimum amount required to use this coupon.'
                    );
                }


                if (!$this->checkMinimumItems($coupon, $items)) {
                    throw new CouponException(
                        'Your order does not have enough items to use this coupon.'
                    );
                }
        }
        
        public  function couponApplicationResult(CheckoutContext $context): array | null {
            $dto = $context->dto;

            if (!$dto->coupon_code) {
                return null;
            }

            $coupon = $this->getDbCouponCodeMatch($dto->coupon_code);
            
            if (!$coupon) {
                return null ;
            }

            try {
                $this->checkIsValidCoupon($coupon, $context->user);
                $eligibility = $this->cartService->getCartEligibility($coupon , $context->dto->items) ?? [];
                $this->assertCouponApplicable($coupon, $eligibility['eligibleItems']);
                return ['coupon' => $coupon , 'eligibleItems' => $eligibility['eligibleItems']];
            } catch (CouponException $e) {
                return null;
            }
        }

        public function updateCouponInOrderUsage(int|string $coupon_id)
        {
            $coupon = Coupon::find($coupon_id);

            if (!$coupon) {
                    throw new \Exception("Coupon {$coupon_id} not found.");
                }
            $updated = Coupon::where('id', $coupon_id)
                ->where(function ($q) {
                    $q->whereNull('max_uses')       // unlimited
                    ->orWhereColumn('times_used', '<', 'max_uses'); // still has uses
                })
                ->update([
                    'times_used' => DB::raw('times_used + 1'),
                    'is_active' => DB::raw('CASE WHEN max_uses IS NOT NULL AND times_used + 1 >= max_uses THEN 0 ELSE 1 END')
                ]);

            if ($updated === 0) {
                throw new \Exception("Coupon no longer valid or has reached its usage limit.");
            }
            return $updated;
        }

}
