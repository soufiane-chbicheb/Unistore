<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
     private $catgeries = [
       "Fashion & Apparel"  , 
        "Electronics & Gadgets" ,
         "Beauty & Personal Care" ,
        "Perfumes" ,
        "Home & Living" ,
         "Sports & Outdoors" ,
        "Toys & Games" ,
        "Jewelry & Accessories" ,
        "Baby & Kids" 
     ];

    public function definition(): array
    {
        return [
            "name"=> $this->faker->name,
            "slug"=> $this->faker->slug,
            'store_id' => Store::inRandomOrder()->first()?->id ?? 1,
        ];
    }
}
