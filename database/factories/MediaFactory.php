<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition()
    {
        return [
            'collection' => 'thumbnail',
            'url' => 'storage/products/1.jpg', // Will be overridden in seeder
            'disk' => 'public',
            'media_type' => 'image',
            'mediaable_type' => Product::class,
            'mediaable_id' => 1, // Will be overridden in seeder
            'size' => $this->faker->numberBetween(50000, 500000),
            'width' => 800,
            'height' => 600,
            'is_temporary' => true,
            'order' => 0,
        ];
    }
} 