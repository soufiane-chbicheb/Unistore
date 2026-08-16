<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition()
    {
        $productVariant = ProductVariant::factory()->create();
        return [
            'product_variant_id' => $productVariant->id,
            'order_id' => Order::inRandomOrder()->first()->id  ,
            'product_name' => $productVariant->product->name, // snapshot
            'price_snapshot' => $productVariant->price,
            'subtotal' => $productVariant->price * random_int(1,100),
            'quantity' => $this->faker->numberBetween(1, 3),
            // 'options' => $this->faker->boolean(60) ? [
            //     'color' => $this->faker->randomElement(['Black', 'White', 'Red']),
            //     'size' => $this->faker->randomElement(['S', 'M', 'L']),
            // ] : null,
        ];
    }
}
