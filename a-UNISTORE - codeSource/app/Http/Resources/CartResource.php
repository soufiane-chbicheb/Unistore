<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {    
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'product_variant_id' => $this->product_variant_id,
            'quantity' => $this->quantity,
            'price_snapshot' => $this->price_snapshot,
            'product_variant' => $this->productVariant,
            'subtotal' => $this->productVariant ? $this->productVariant->price * $this->quantity : 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ] ;
    }



}
