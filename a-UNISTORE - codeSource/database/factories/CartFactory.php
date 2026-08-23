<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

use function Laravel\Prompts\table;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {  
        
        return [
            'user_id' => User::inRandomOrder()->first()->id ,
            'product_variant_id' => ProductVariant::inRandomOrder()->first()->id ,
            'quantity' => $this->faker->numberBetween(1,5),
            'price_snapshot'=> $this->faker->numberBetween(1,100),
            'cart_token' => Str::slug($this->faker->numberBetween(1,100)),
        ];
    }
}
