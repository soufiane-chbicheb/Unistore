<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class storeSettingSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        $defaultSettings = [
            // Tax
            ['key' => 'tva_enabled',     'value' => false],
            ['key' => 'tva_rate',        'value' => 20],

            ['key' => 'admin_theme_style',        'value' => 'orangeNight'],
            ['key' => 'store_card_config',        'value' => [
                    'cardId' => 'card-6',
                    'showPrice' => true,
                    'showRating' => true,
                    'showBorder' => true,
                    'isRounded' => true,
                    'borderRadius' => '10px',
                ]
            ],
            ['key' => 'store_layout_style',        'value' => 'grid'],
            ['key' => 'store_theme_style',        'value' => 'softPastel'],

            // Payments
            ['key' => 'cod_enabled',     'value' => true],
            ['key' => 'payment_enabled', 'value' => true],

            // Store
            ['key' => 'currency',        'value' => 'MAD'],

            // Theme
            ['key' => 'theme_id',        'value' => 1],
        ];

        foreach ($defaultSettings as $setting) {
            \App\Models\StoreSetting::updateOrCreate(
                [
                    'key' => $setting['key'],
                    'store_id' => $storeId,
                ],
                ['value' => $setting['value']]
            );
        }
    }
}