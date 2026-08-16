<?php

namespace App\DTOs\Order;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Product;
use App\Models\ShippingZoneCity;
use App\Models\User;
use DateTime;
use Illuminate\Support\Facades\Auth;

class CreateOrderDTO
{
    public function __construct(
        public readonly ?string $order_number = null, 
        public readonly ?string $payment_method_id = null, 
        public readonly ?int $user_id = null,
        public readonly ?string $tracking_token = null , 
        public readonly ?string $notes , 
        public readonly string $payment_method,
        public readonly array $items,              // Array of OrderItemDTO
        public readonly OrderAddressDTO $address,  // Nested DTO
        public readonly ?string $coupon_code = null,
        public readonly ?DateTime $paid_at,
        public readonly ?float $tax = 0.0,
        public readonly ?int $total_amount = 0 ,
        public readonly ?int $discount_amount = 0 ,
        public readonly ?int $shipping_cost = 0,
        public readonly ?int $coupon_id = null,
        public readonly ?int $promotion_id = null,
        public readonly ?bool $coupon_counted = false,
        public readonly ?bool $promotion_counted = false,
        public readonly ?string $order_status = 'pending',
        public readonly ?string $payment_status = 'pending',
    ) {}
    
    public static function fromRequest(array $data , ?User $user, ?array $calulations = []): self
    {


        return new self(
            user_id: $user?->id,
            payment_method: $data['payment_method'],
            payment_method_id: $data['payment_method_id'] ?? null,
            items: array_map(
                fn($item) => OrderItemDTO::fromArray($item),
                $data['items']
            ),
            address: OrderAddressDTO::fromArray($data['address']),
            coupon_code: $data['coupon_code'] ,
            notes : $data['notes']  ,

            shipping_cost: $calulations['shipping_cost'] ?? 0 ,
            total_amount: $calulations['total_amount'] ?? 0,
            tax : $calulations['tax'] ?? 0,
            paid_at : $calulations['paid_at'] ?? null,
            discount_amount: $calulations['discount_amount'] ??  0 ,
            order_number: $calulations['order_number'] ?? null,
            tracking_token: $calulations['tracking_token'] ?? null,
            coupon_id : $calulations['coupon_id'] ?? null,
            promotion_id : $calulations['promotion_id'] ?? null ,
            order_status : $calulations['order_status'] ?? 'pending' ,
            payment_status : $calulations['payment_status'] ?? 'pending',
            coupon_counted : $calulations['coupon_counted']  ?? false,
            promotion_counted : $calulations['promotion_counted'] ?? false  ,
        );
    }

    public static function fromPayment(array $data  ,?User $user , array $calculations ) : self
    {
        return self::fromRequest($data , $user , $calculations);
    }

    public static function fromCheckout(array $data ,?User $user , array $calculations ): self
    {

        return self::fromRequest($data , $user , $calculations);
    }
    

    public function toArray(): array
    {
        return [
            'user_id'           => $this->user_id,
            'coupon_id' =>$this->coupon_id ,
            'promotion_id' => $this->promotion_id ,
            'order_number'      => $this->order_number,
            'tracking_token' =>  $this->tracking_token ,
            'payment_method_id' => $this->payment_method_id,
            'payment_method'    => $this->payment_method,
            'coupon_code'       => $this->coupon_code,
            'notes'             => $this->notes,
            'paid_at'           => $this->paid_at,
            'tax'               => $this->tax,
            'total_amount'      => $this->total_amount,
            'discount_amount'   => $this->discount_amount,
            'shipping_cost'     => $this->shipping_cost,
            'items'             => array_map(fn($item) => $item->toArray(), $this->items),
            'address'           => $this->address->toArray(),
            'order_status' => $this->order_status ,
            'payment_status' => $this->payment_status,
            'coupon_counted' => $this->coupon_counted ,
            'promotion_counted' => $this->promotion_counted ,
        ];
    }
}


// Nested DTO for address
class OrderAddressDTO
{
    public function __construct(
        public readonly string $first_name ,
        public readonly string $last_name ,
        public string $address_line1,
        public ?string $address_line2,
        public string $city,
        public string $phone ,
        public ?string $email = null,
    ) {
    }
    
    public function toArray(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'address_line1'=> $this->address_line1,
            'address_line2'=> $this->address_line2,
            'city'=> $this->city,
            'phone' => $this->phone ,
            'email' => $this->email ,
        
        ];
    }
    public static function fromArray(array $data): self
    {
        return new self(
            first_name: $data["first_name"],
            last_name: $data["last_name"],
            address_line1: $data["address_line1"],
            address_line2: $data["address_line2"],
            city: $data["city"],
            phone: $data["phone"],
            email: $data["email"],
        );
    }
}
