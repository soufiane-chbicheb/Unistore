<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;
        Tag::query()->delete();
        Tag::factory()->count(10)->create(['store_id' => $storeId]);
        
    }
}
