<?php

namespace Database\Seeders;

use App\Models\AttributesValues;
use Illuminate\Database\Seeder;
use App\Models\AttributeValue;

class AttributeValuesSeeder extends Seeder
{
    public function run(): void
    {
        $values = [

            // 🎨 COLORS (attribute_id = 1)
            [
                'attribute_id' => 1,
                'name' => 'Red',
                'value' => '#FF0000',
                'meta' => [
                    'hex' => '#FF0000',
                ],
            ],
            [
                'attribute_id' => 1,
                'name' => 'Blue',
                'value' => '#0000FF',
                'meta' => [
                    'hex' => '#0000FF',
                ],
            ],
            [
                'attribute_id' => 1,
                'name' => 'Black',
                'value' => '#000000',
                'meta' => [
                    'hex' => '#000000',
                ],
            ],

            // 📏 SIZES (attribute_id = 2)
            [
                'attribute_id' => 2,
                'name' => 'Small',
                'value' => 'S',
                'meta' => [
                    'order' => 1,
                ],
            ],
            [
                'attribute_id' => 2,
                'name' => 'Medium',
                'value' => 'M',
                'meta' => [
                    'order' => 2,
                ],
            ],
            [
                'attribute_id' => 2,
                'name' => 'Large',
                'value' => 'L',
                'meta' => [
                    'order' => 3,
                ],
            ],

            // 🧵 MATERIAL (attribute_id = 3)
            [
                'attribute_id' => 3,
                'name' => 'Cotton',
                'value' => 'cotton',
                'meta' => [
                    'natural' => true,
                ],
            ],
            [
                'attribute_id' => 3,
                'name' => 'Denim',
                'value' => 'denim',
                'meta' => [
                    'natural' => false,
                ],
            ],

            // 👕 STYLE (attribute_id = 4)
            [
                'attribute_id' => 4,
                'name' => 'Streetwear',
                'value' => 'streetwear',
                'meta' => [
                    'trend' => 'urban',
                ],
            ],
            [
                'attribute_id' => 4,
                'name' => 'Casual',
                'value' => 'casual',
                'meta' => [
                    'trend' => 'everyday',
                ],
            ],
        ];

        foreach ($values as $value) {
            AttributesValues::create($value);
        }
    }
}
