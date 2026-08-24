<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Color>
 */
class ColorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public     $colorCodes = [
        "#ef4444", // red-500
        "#3b82f6", // blue-500
        "#22c55e", // green-500
        "#000000",
        "#ffffff",
        "#eab308", // yellow-500
        "#8b5cf6", // purple-500
        "#ec4899"
    ];
    public function definition(): array
    {
   
        return [
            "hex" => fake()->randomElement($this->colorCodes)
        ];
    }
}
