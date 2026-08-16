<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VariantOptionSeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            'size'  => ['XS', 'S', 'M', 'L', 'XL'],

            'color' => [
                ['name' => 'Red',  'hex' => '#ff0000ff'],
                ['name' => 'Blue', 'hex' => '#0015ffff'],
            ],

            'ram'   => ['4GB', '8GB', '16GB', '32GB'],
        ];

        foreach ($parents as $parentKey => $children) {

            // Use updateOrInsert to avoid duplicate parent keys
            DB::table('variants_options_settings')->updateOrInsert(
                ['key' => $parentKey, 'parent_id' => null],
                ['value' => null, 'hex' => null]
            );

            $parentId = DB::table('variants_options_settings')
                ->where('key', $parentKey)
                ->whereNull('parent_id')
                ->first()
                ->id;

            foreach ($children as $childValue) {

                // If color (array with name + hex)
                if ($parentKey === 'color') {
                    DB::table('variants_options_settings')->updateOrInsert(
                        ['key' => $parentKey, 'value' => $childValue['name'], 'parent_id' => $parentId],
                        ['hex' => $childValue['hex']]
                    );
                } 
                // Normal options
                else {
                    DB::table('variants_options_settings')->updateOrInsert(
                        ['key' => $parentKey, 'value' => $childValue, 'parent_id' => $parentId],
                        ['hex' => null]
                    );
                }
            }
        }
    }
}