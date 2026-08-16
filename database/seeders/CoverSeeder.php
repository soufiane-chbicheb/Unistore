<?php

namespace Database\Seeders;

use App\Models\Cover;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class CoverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $products = Product::all();
        foreach ($products as $product) {
            $randomimgs =  collect()->times(4, function () use ($faker) {
                return $faker->numberBetween(1, 10) . '.png';
            });

            foreach ($randomimgs as $randomimg) {
                $exist = Cover::where('product_id', $product->id)
                    ->where('path', $randomimg)
                    ->first();


                if ($exist) {
                    $this->command->warn('the cover is exist already');
                } else {
                    Cover::factory()->create([
                        'product_id' => $product->id,
                        'path' => $randomimg
                    ]);
                }
            }
        }
    }
}
