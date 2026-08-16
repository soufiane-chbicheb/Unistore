<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stores = [
            [
                'name' => 'Boutique Tech',
                'slug' => 'boutique1',
                'domain' => 'boutique1.lvh.me',
            ],
            [
                'name' => 'Fashion Store',
                'slug' => 'boutique2',
                'domain' => 'boutique2.lvh.me',
            ],
        ];

        foreach ($stores as $store) {
            Store::firstOrCreate(
                ['slug' => $store['slug']],
                [
                    'name' => $store['name'],
                    'domain' => $store['domain'],
                ]
            );
        }
    }
}
