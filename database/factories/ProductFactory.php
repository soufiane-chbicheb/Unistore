<?php

namespace Database\Factories;

use App\Models\Badge;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
{
    return [
        'store_id'          => Store::inRandomOrder()->first()?->id ?? 1,
        'name'              => $this->faker->words(4, true),
        'brand'             => $this->faker->company(),
        'product_attributes' => [
            [
                'key' => "material" ,
                'values' => ["couton " , "delim"]
            ] ,
            [
                'key' => "style" ,
                'values' => ["casual" , "formal"]
            ]
        ] ,
        'category_niche_id' => Category::where('parent_id' , null)->first()->id,
        'description'       => $this->faker->paragraphs(2, true),
        'is_featured'        => $this->faker->boolean(),
        'is_visible'        => $this->faker->boolean(),
        'madeCountry'       => $this->faker->countryCode(),
        'releaseDate'       => (string) $this->faker->numberBetween(2015, 2024),
        'badge_id'        => Badge::inRandomOrder()->first()->id,
        'allow_backorder'   => $this->faker->boolean(),
        'show_countdown'    => true,
        'show_reviews'      => true,
        'show_related_products' => true,
        'show_social_share' => true,
        'inventory' => [
            'backorderOptions'   => 'deny',
            'trackInventory'     => true,
            'lowStockThreshold'  => 5,
            'stockStatus'        => 'in_stock',
            'weight'             => 1.5,
            'weightUnit'         => 'kg',
            'dimensions'         => ['length' => 20, 'width' => 15, 'height' => 10, 'unit' => 'cm'],
            'warehouseLocation'  => 'A1-B2',
            'fulfillmentType'    => 'dropship',
        ],
        'shipping' => [
            'shippingClass'        => 'express',
            'shippingCostOverride' => 9.99,
            'isReturnable'         => true,
            'returnWindow'         => 30,
            'returnPolicy'         => 'free_return',
        ],
        'meta' => [
            'metaTitle'       => $this->faker->words(6, true),
            'metaDescription' => $this->faker->sentence(20),
        ],
        'vendor' => [
            'vendorName'  => $this->faker->company(),
            'vendorSku'   => strtoupper($this->faker->bothify('SUP-####')),
            'vendorNotes' => $this->faker->sentence(),
        ],
        'faqs' => [
            ['question' => 'What is the warranty?',       'answer' => '1 year manufacturer warranty.'],
            ['question' => 'Is free shipping available?', 'answer' => 'Yes on orders over $50.'],
        ],
        'related_product_ids' => [],
    ];
}

    // ── States ────────────────────────────────────────────────────────────
    public function draft(): static
    {
        return $this->state(['status' => 'draft', 'ready_to_publish' => false]);
    }

    public function published(): static
    {
        return $this->state(['status' => 'published', 'ready_to_publish' => true]);
    }

    public function featured(): static
    {
        return $this->state(['isFeatured' => true]);
    }
}