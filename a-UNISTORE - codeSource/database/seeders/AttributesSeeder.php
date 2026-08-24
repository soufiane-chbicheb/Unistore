<?php

namespace Database\Seeders;


use App\Models\PAttr;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;

        $attributes = [
            [
                'name' => 'Color',
                'slug' => 'color',
                'type' => 'button',
                'store_id' => $storeId,
            ],
            [
                'name' => 'Size',
                'slug' => 'size',
                'type' => 'radio',
                'store_id' => $storeId,
            ],
            [
                'name' => 'Material',
                'slug' => 'material',
                'type' => 'button',
                'store_id' => $storeId,
            ],
           
        ];

        foreach ($attributes as $attr) {
            PAttr::updateOrCreate(['slug' => $attr['slug'], 'store_id' => $storeId], $attr);
        }
    }
}
