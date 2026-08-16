<?php

namespace Database\Seeders;

use App\Models\RuleBasedCollection;
use App\Models\Store;
use Illuminate\Database\Seeder;

class RuleBasedCollectionsSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        RuleBasedCollection::query()->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // Target IDs from Audit:
        // Badges: New (2), Featured (6), Hot (3), Sale (4)
        // Categories: Shoes (5), Watches (63)

        $collections = [
            [
                'name' => 'New Season Arrivals',
                'slug' => 'new-season-arrivals',
                'key' => 'home.new_arrivals',
                'is_active' => true,
                'layout_config' => [
                    'displayLimit' => 12,
                    'gap' => 24,
                    'paddingInline' => 0
                ],
                'card_config' => [
                    'aspectRatio' => '3/4',
                    'borderRadius' => 0,
                    'showPrice' => true,
                    'showBadge' => true,
                    'textAlign' => 'left',
                    'hoverEffect' => 'zoom'
                ],
                'rules' => [
                    ['field' => 'badge_id', 'operator' => '=', 'value' => '2']
                ],
            ],
            [
                'name' => 'The Featured Edit',
                'slug' => 'the-featured-edit',
                'key' => 'home.featured',
                'is_active' => true,
                'layout_config' => [
                    'displayLimit' => 12,
                    'gap' => 24,
                    'paddingInline' => 0
                ],
                'card_config' => [
                    'aspectRatio' => '3/4',
                    'borderRadius' => 0,
                    'showPrice' => true,
                    'showBadge' => true,
                    'textAlign' => 'left',
                    'hoverEffect' => 'zoom'
                ],
                'rules' => [
                    ['field' => 'badge_id', 'operator' => '=', 'value' => '6']
                ],
            ],
            [
                'name' => 'Performance Footwear',
                'slug' => 'performance-footwear',
                'key' => 'home.shoes',
                'is_active' => true,
                'layout_config' => [
                    'displayLimit' => 10,
                    'gap' => 24,
                    'paddingInline' => 0
                ],
                'card_config' => [
                    'aspectRatio' => '1/1',
                    'borderRadius' => 12,
                    'showPrice' => true,
                    'showBadge' => true,
                    'textAlign' => 'center',
                    'hoverEffect' => 'zoom'
                ],
                'rules' => [
                    ['field' => 'category_id', 'operator' => '=', 'value' => '5']
                ],
            ],
            [
                'name' => 'Luxury Timepieces',
                'slug' => 'luxury-timepieces',
                'key' => 'home.watches',
                'is_active' => true,
                'layout_config' => [
                    'displayLimit' => 10,
                    'gap' => 24,
                    'paddingInline' => 0
                ],
                'card_config' => [
                    'aspectRatio' => '1/1',
                    'borderRadius' => 12,
                    'showPrice' => true,
                    'showBadge' => true,
                    'textAlign' => 'left',
                    'hoverEffect' => 'none'
                ],
                'rules' => [
                    ['field' => 'category_id', 'operator' => '=', 'value' => '63']
                ],
            ],
        ];

        foreach ($collections as $cData) {
            $cData['store_id'] = $storeId;
            RuleBasedCollection::create($cData);
        }
    }
}