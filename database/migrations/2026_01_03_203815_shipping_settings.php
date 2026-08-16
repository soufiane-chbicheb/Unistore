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
        Schema::create('shipping_settings', function (Blueprint $table) {
            $table->id();
            $table->enum('free_shipping_type', ['amount', 'items', 'either', 'both'])->default('amount');
            $table->decimal('free_shipping_threshold_amount', 10, 2)->nullable(); // 500 MAD
            $table->integer('free_shipping_threshold_items', )->nullable();       // 5 items
            $table->decimal('base_weight_kg', 8, 2)->nullable();           // 2kg
            $table->decimal('extra_kg_price', 8, 2)->nullable();           // 5 MAD/kg
            $table->json("shipping_class");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
