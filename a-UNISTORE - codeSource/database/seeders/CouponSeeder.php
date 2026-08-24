<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \Illuminate\Support\Facades\Schema;
class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $storeId = Store::first()->id;

        // Clear existing coupons to avoid duplicates during presentation seeding
        Schema::disableForeignKeyConstraints();
        Coupon::query()->delete();
        Schema::enableForeignKeyConstraints();

        // 1. No Rules Coupon - Perfect for testing basic flow
        Coupon::create([
            'store_id' => $storeId,
            'code' => 'allcanuseitnorules',
            'description' => 'Unlimited General Discount',
            'type' => 'fixed',
            'value' => 10,
            'is_active' => true,
            'max_uses' => null,
            'times_used' => 0,
            'max_uses_per_user' => 100,
            'minimum_order_amount' => 0,
            'minimum_items' => 1,
            'valid_from' => now()->subDays(1),
            'valid_until' => now()->addYears(1),
        ]);

        // 2. High Value - Minimum Amount Required
        Coupon::create([
            'store_id' => $storeId,
            'code' => 'BIGSPENDER50',
            'description' => 'Premium Order Discount (Requires $200 min spend)',
            'type' => 'fixed',
            'value' => 50,
            'is_active' => true,
            'minimum_order_amount' => 200,
            'minimum_items' => 1,
            'max_uses_per_user' => 1,
            'valid_from' => now()->subDays(1),
        ]);

        // 3. Percentage - Minimum Items Required
        Coupon::create([
            'store_id' => $storeId,
            'code' => 'BUYMORE20',
            'description' => 'Bulk Purchase Reward (Requires 3+ items)',
            'type' => 'percentage',
            'value' => 20,
            'is_active' => true,
            'minimum_order_amount' => 0,
            'minimum_items' => 3,
            'max_uses_per_user' => 5,
            'valid_from' => now()->subDays(1),
        ]);

        // 4. Usage Limited - Already Sold Out
        Coupon::create([
            'store_id' => $storeId,
            'code' => 'LIMITED10',
            'description' => 'Flash Sale (Fully used up)',
            'type' => 'fixed',
            'value' => 10,
            'is_active' => true,
            'max_uses' => 5,
            'times_used' => 5, // Already reached limit
            'valid_from' => now()->subDays(1),
        ]);

        // 5. Time Limited - Not Yet Active
        Coupon::create([
            'store_id' => $storeId,
            'code' => 'FUTURE15',
            'description' => 'Upcoming Holiday Sale (Starts in a week)',
            'type' => 'percentage',
            'value' => 15,
            'is_active' => true,
            'valid_from' => now()->addDays(7), // Starts in a week
            'valid_until' => now()->addDays(14),
        ]);

        // 6. Basic Active Percentage
        Coupon::factory()->active()->percentage()->create(['store_id' => $storeId, 'code' => 'SAVE10', 'value' => 10, 'description' => 'Save 10% on your order']);
        
        // 7. Basic Active Fixed
        Coupon::factory()->active()->fixed()->create(['store_id' => $storeId, 'code' => 'FLAT25', 'value' => 25, 'description' => 'Flat $25 discount']);
    }
}
