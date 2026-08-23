<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;
        Review::query()->delete();
        Review::factory()->count(10)->create(['store_id' => $storeId]);
    
    }
}
