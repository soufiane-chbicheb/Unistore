<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
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
        Schema::create('products_cart', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ProductVariant::class , 'product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('cart_token')->nullable(); // for guest users
            $table->integer('quantity')->default(1);
            // Store price at the moment to avoid price changes affecting cart
            $table->decimal('price_snapshot', 10, 2)->nullable();
            $table->decimal('subtotal', 10, 2)->storedAs('price_snapshot * quantity');
            $table->index(['user_id', 'product_variant_id']);
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_products');
    }
};
