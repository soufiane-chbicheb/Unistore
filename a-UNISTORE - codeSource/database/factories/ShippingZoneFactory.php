<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingZoneFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id'       => Store::inRandomOrder()->first()?->id ?? 1,
            'name'           => $this->faker->word(),
            'type'           => $this->faker->randomElement(['fixed', 'calculated']),
            'price'          => $this->faker->randomElement([30, 40, 50, 60]),
            'estimated_days' => $this->faker->randomElement([1, 2, 3, 5]),
            'is_active'      => true,
        ];
    }

    public function major(): static
    {
        return $this->state(fn () => [
            'name'           => 'Major Cities',
            'price'          => 30.00,
            'estimated_days' => 2,
        ]);
    }

    public function secondary(): static
    {
        return $this->state(fn () => [
            'name'           => 'Secondary Cities',
            'price'          => 40.00,
            'estimated_days' => 3,
        ]);
    }

    public function remote(): static
    {
        return $this->state(fn () => [
            'name'           => 'Remote Areas',
            'price'          => 60.00,
            'estimated_days' => 5,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}