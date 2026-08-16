<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Coupon;
use App\Models\Promotion;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $paymentMethod = $this->faker->randomElement(['cod', 'card', 'paypal']);
        $paymentStatus = 'pending';
        $paidAt = null;

        // If card or paypal → sometimes paid
        if (in_array($paymentMethod, ['card', 'paypal'])) {
            $paymentStatus = $this->faker->randomElement(['pending', 'paid', 'failed']);

            if ($paymentStatus === 'paid') {
                $paidAt = now();
            }
        }

        return [
            'store_id'          => Store::inRandomOrder()->first()?->id ?? 1,
            'order_number'      => 'ORD-' . strtoupper(Str::random(8)),
            'user_id'           => User::factory(),
            'coupon_id'         => null,
            'promotion_id'      => null,

            'payment_status'    => $paymentStatus,
            'order_status'      => 'pending',

            'coupon_counted'    => false,
            'promotion_counted' => false,

            'tax'               => $this->faker->randomFloat(2, 0, 50),
            'currency'          => 'MAD',
            'payment_method'    => $paymentMethod,
            'tracking_token'    => Str::random(40),
            'paid_at'           => $paidAt,
            'shipping_cost'     => $this->faker->randomFloat(2, 10, 100),
            'discount_amount'   => $this->faker->randomFloat(2, 0, 100),
            'total_amount'      => $this->faker->randomFloat(2, 100, 2000),
            'notes'             => $this->faker->sentence(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    public function paid()
    {
        return $this->state(function () {
            return [
                'payment_status' => 'paid',
                'paid_at' => now(),
            ];
        });
    }

    public function confirmed()
    {
        return $this->state(function () {
            return [
                'order_status' => 'confirmed',
            ];
        });
    }

    public function delivered()
    {
        return $this->state(function () {
            return [
                'order_status' => 'delivered',
            ];
        });
    }

    public function cancelled()
    {
        return $this->state(function () {
            return [
                'order_status' => 'cancelled',
            ];
        });
    }

    public function withCoupon()
    {
        return $this->state(function () {
            return [
                'coupon_id' => Coupon::factory(),
            ];
        });
    }

    public function withPromotion()
    {
        return $this->state(function () {
            return [
                'promotion_id' => Promotion::factory(),
            ];
        });
    }
}