<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'users',
            'categories',
            'products',
            'orders',
            'coupons',
            'promotions',
            'banners',
            'shipping_settings',
            'reviews',
            'tags',
            'rule_based_collections',
            'sliders',
            'store_settings',
            'shipping_zones',
            'products_cart',
            'wish_lists',
            'badges',
            'store_events',
            'invitations',
            'home_layout_orcs',
            'product_attributes',
            'google_sheets'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Only add store_id if it doesn't already exist from the base migration
                if (!Schema::hasColumn($tableName, 'store_id')) {
                    $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'users',
            'categories',
            'products',
            'orders',
            'coupons',
            'promotions',
            'banners',
            'shipping_settings',
            'reviews',
            'tags',
            'rule_based_collections',
            'sliders',
            'store_settings'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['store_id']);
                $table->dropColumn('store_id');
            });
        }
    }
};
