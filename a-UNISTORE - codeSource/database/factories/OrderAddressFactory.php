<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\OrderAddress;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderAddressFactory extends Factory
{
    protected $model = OrderAddress::class;
     use HasFactory;
    public function definition()
    {
        return [
            'type' => $this->faker->randomElement(['shipping', 'billing']),
            'first_name' => $this->faker->name(),
            'last_name' => $this->faker->name(),
            'address_line1' => $this->faker->streetAddress(),
            'address_line2' => $this->faker->boolean(30) ? $this->faker->secondaryAddress() : null,
            'city' => $this->faker->randomElement(['Casablanca', 'Rabat', 'Marrakech', 'Agadir']),
            'phone' => '06' . $this->faker->numberBetween(10000000, 99999999),
            'email' => $this->faker->email(),
        ];
    }
}
