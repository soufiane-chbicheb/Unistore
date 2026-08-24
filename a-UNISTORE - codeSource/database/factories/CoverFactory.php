<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cover>
 */
class CoverFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {   
        $baseimg = $this->faker->numberBetween(100,115);
        return [
            "path"=> '/storage/covers/'. $baseimg.'.png', 
            'product_id' => Product::inRandomOrder()->first()->id ?? Category::factory()->create()->id
        ];
    }
}
