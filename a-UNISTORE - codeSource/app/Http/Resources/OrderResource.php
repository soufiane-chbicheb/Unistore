<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class OrderResource extends JsonResource
{
    public static $wrap = null;
    public function toArray(Request $request){
        $order = Parent::toArray($request);
        // dd($order);
        return array_merge(
            Arr::except($order, ['user']),
            [
                'customer' => $this->user,
                'order_items' => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->map(function ($item) {
                    return [
                        'itemId' =>  $item->product?->id ,
                        'itemImage' => $item->product?->thumbnail,
                        'itemName'  => $item->product?->name,
                        'itemPrice' => $item->price ,
                        'itemQuantity' => $item->quantity
                    ];
                });
            }),

           
            ]
        );
    }
}
