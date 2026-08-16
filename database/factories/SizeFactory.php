<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Size>
 */
class SizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
private $sizes = [
    'extra_small' => 'XS',
    'small'       => 'S',
    'medium'      => 'M',
    'large'       => 'L',
    'extra_large' => 'XL',
    'xxl'         => 'XXL',
    'xxxl'        => 'XXXL',
    '30'        => '30',
    '31'        => '31',
    '32'        => '32',
    '33'        => '33',
    '34'        => '34',
    '35'        => '35',
    '36'        => '36',
    '37'        => '37',
    '38'        => '38',
    '39'        => '39',
    '40'        => '40',

];

    public function definition(): array
    {  
        $size = $this->faker->randomElement(array_keys($this->sizes)) ;
        return [
            'name' => $size,
            'abbr' => $this->sizes[$size],
        ];
    }
}
