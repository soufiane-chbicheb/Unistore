<?php
namespace App\DTOs\Order;

class OrderItemDTO
{
    public function __construct(
        public int $product_variant_id,
        public int $quantity,
        public float $price_snapshot,
        public float $subtotal,
        public string $product_name,
        public array  $product_variant ,
        public array  $product
    ) { }



    public static function fromArray(array $data): self
    {
        return new self(
            product_variant_id: $data["product_variant_id"],
            quantity: $data["quantity"],
            price_snapshot: $data["price_snapshot"],
            subtotal: $data["subtotal"],
            product_name : $data["product_variant"]['product']['name'] ?? 'Unknown Product',
            product : $data['product_variant']['product'] ,
            product_variant : $data['product_variant']
        );
    }

     public function toArray(): array
    {
        return [
            "product_variant_id"=> $this->product_variant_id,
            "product_name"=> $this->product_name,
            "quantity"=> $this->quantity,
            "product" => $this->product ,
            "product_variant" => $this->product_variant ,
            "price_snapshot"=> $this->price_snapshot,
            "subtotal"=> $this->subtotal,

        ];
    }
}
