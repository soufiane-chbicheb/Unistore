<?php

namespace Database\Seeders;

use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Models\Store;
use Database\Factories\ShippingZoneCityFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {    
         $storeId = Store::first()->id;

         \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
         ShippingZoneCity::query()->delete();
         ShippingZone::query()->delete();
         \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

         $cities1 = collect(['Casablanca', 'Rabat', 'Marrakech', 'Agadir', 'Fes'])
         ->shuffle();

        $cities2 = collect(['Tanger', 'Meknes'])
            ->shuffle();

        $cities4 = collect(['Oujda', 'Kenitra', 'Tetouan', 'Safi'])
            ->shuffle();

        $cities1->each(function($city) use ($storeId) {
            ShippingZone::factory()->major()
                ->has(ShippingZoneCity::factory()->state(['city' => $city]), 'cities')
                ->create(['store_id' => $storeId]);
        });

        $zone2 = ShippingZone::factory()->secondary()->create(['store_id' => $storeId]);
        $cities2->each(fn($city) => ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone2->id,
        ]));

        $zone4 = ShippingZone::factory()->remote()->create(['store_id' => $storeId]);
        $cities4->each(fn($city) => ShippingZoneCity::factory()->create([
            'city'             => $city,
            'shipping_zone_id' => $zone4->id,
        ]));
         
    }
}
