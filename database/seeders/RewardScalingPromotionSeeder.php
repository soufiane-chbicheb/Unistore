<?php

namespace Database\Seeders;

use App\Models\Promotion;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class RewardScalingPromotionSeeder extends Seeder
{
    /**
     * Run the database seeds to create a progressive reward scaling system.
     * This ensures milestones (goals) and estimated values increase logically.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;

        Schema::disableForeignKeyConstraints();
        Promotion::query()->delete();
        Schema::enableForeignKeyConstraints();

        // Progressive Tiered Promotions
        $tiers = [
        
            [
                'name' => 'Bronze Tier',
                'type' => 'percentage',
                'value' => 10,
                'min_amount' => 500,
                'max_discount' => 80,
            ],
       
            [
                'name' => 'Gold Privilege',
                'type' => 'percentage',
                'value' => 20,
                'min_amount' => 1000,
                'max_discount' => 100,
            ],
          
            [
                'name' => 'Diamond Elite',
                'type' => 'percentage',
                'value' => 30,
                'min_amount' => 2000,
                'max_discount' => 400,
            ],
        ];

        foreach ($tiers as $tier) {
            Promotion::create([
                'store_id' => $storeId,
                'name' => $tier['name'],
                'type' => $tier['type'],
                'value' => $tier['value'],
                'minimum_order_amount' => $tier['min_amount'],
                'max_discount_amount' => $tier['max_discount'],
                'is_active' => true,
                'valid_from' => now()->subDays(1),
                'valid_until' => now()->addYear(),
            ]);
        }

        // Add a Free Shipping Milestone as well
        Promotion::create([
            'store_id' => $storeId,
            'name' => 'Free Express Shipping',
            'type' => 'free_shipping',
            'value' => 0,
            'minimum_order_amount' => 1500,
            'is_active' => true,
            'valid_from' => now()->subDays(1),
            'valid_until' => now()->addYear(),
        ]);
    }
}
