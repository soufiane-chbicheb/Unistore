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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('code'); // SUMMER2024, WELCOME10
            $table->string('description')->nullable(); // "Summer sale discount"
            
            // Discount Type
            $table->enum('type', ['percentage', 'fixed']); // 20% off OR 50 MAD off
            $table->decimal('value', 10, 2); // 20.00 (for 20%) or 50.00 (for 50 MAD)
            
            // Minimum Requirements
            $table->decimal('minimum_order_amount', 10, 2)->nullable(); // Min 200 MAD to use coupon
            $table->integer('minimum_items')->nullable(); // Min 2 items required
            
            // Usage Limits
            $table->integer('max_uses')->nullable(); // Total times coupon can be used (null = unlimited)
            $table->integer('max_uses_per_user')->default(1); // How many times ONE user can use it
            $table->integer('times_used')->default(0); // Track how many times it's been used
            
            // Validity Period
            $table->dateTime('valid_from')->nullable();
            $table->dateTime('valid_until')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            
            // Optional: Specific Products/Categories
            $table->json('applicable_product_ids')->nullable(); // [1, 2, 5] - only these products
            $table->json('applicable_category_ids')->nullable(); // [3, 7] - only these categories
            $table->json('applicable_sub_category_ids')->nullable(); // [3, 7] - only these categories
            
            $table->timestamps();

            $table->unique(['store_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
