<?php

namespace Database\Seeders;

use App\Models\ShippingSetting;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;

        ShippingSetting::query()->delete();

       // amount based free shipping
        ShippingSetting::factory()->freeByAmount(500)->create(['store_id' => $storeId]);

        // items based
        ShippingSetting::factory()->freeByItems(5)->create(['store_id' => $storeId]);

        // either rule met
        ShippingSetting::factory()->freeByEither(500, 5)->create(['store_id' => $storeId]);

        // both rules must be met + weight pricing
        ShippingSetting::factory()->freeByBoth(500, 5)->withWeightPricing(2, 5)->create(['store_id' => $storeId]);

        // no free shipping at all
        ShippingSetting::factory()->noFreeShipping()->withWeightPricing()->create(['store_id' => $storeId]);

    }
}
