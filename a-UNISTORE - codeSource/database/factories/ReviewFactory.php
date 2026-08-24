<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store_id' => Store::inRandomOrder()->first()?->id ?? 1,
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'product_id' => Product::inRandomOrder()->first()->id,
            'text' => $this->faker->sentence,
            'rating' => $this->faker->randomElement([2.5,3,3.5,4,4.5,5])
        ];
    }
}
