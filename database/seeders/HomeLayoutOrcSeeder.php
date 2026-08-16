<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\HomeLayoutOrc;
use App\Models\RuleBasedCollection;
use Illuminate\Database\Seeder;

class HomeLayoutOrcSeeder extends Seeder
{
    public function run(): void
    {
        HomeLayoutOrc::query()->delete();

        $banners = Banner::orderBy('id')->get();
        $collections = RuleBasedCollection::orderBy('id')->get();

        if ($banners->isEmpty() || $collections->isEmpty()) {
            return;
        }

        $sections = [
            // 1. First Banner
            [
                'sortable_id' => $banners[0]->id,
                'sortable_type' => 'banner',
                'order' => 1,
            ],
            // 2. New Arrivals (First Collection)
            [
                'sortable_id' => $collections->where('key', 'home.new_arrivals')->first()->id ?? $collections[0]->id,
                'sortable_type' => 'product_collection',
                'order' => 2,
            ],
            // 3. Second Banner
            [
                'sortable_id' => $banners[1]->id ?? $banners[0]->id,
                'sortable_type' => 'banner',
                'order' => 3,
            ],
            // 4. Featured Picks (Second Collection)
            [
                'sortable_id' => $collections->where('key', 'home.featured')->first()->id ?? $collections[1]->id ?? $collections[0]->id,
                'sortable_type' => 'product_collection',
                'order' => 4,
            ],
            // 5. Third Banner
            [
                'sortable_id' => $banners[2]->id ?? $banners[0]->id,
                'sortable_type' => 'banner',
                'order' => 5,
            ],
            // 6. Performance Footwear (Third Collection)
            [
                'sortable_id' => $collections->where('key', 'home.shoes')->first()->id ?? $collections[2]->id ?? $collections[0]->id,
                'sortable_type' => 'product_collection',
                'order' => 6,
            ],
            // 7. Fourth Banner
            [
                'sortable_id' => $banners[3]->id ?? $banners[0]->id,
                'sortable_type' => 'banner',
                'order' => 7,
            ],
            // 8. Luxury Timepieces (Fourth Collection)
            [
                'sortable_id' => $collections->where('key', 'home.watches')->first()->id ?? $collections[3]->id ?? $collections[0]->id,
                'sortable_type' => 'product_collection',
                'order' => 8,
            ],
        ];

        foreach ($sections as $section) {
            HomeLayoutOrc::create($section);
        }
    }
}
