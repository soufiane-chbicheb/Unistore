<?php

use App\Models\Product;
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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class)->constrained()->onDelete('cascade');
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('compare_price', 10, 2)->nullable()->default(0);
            $table->integer('stock')->nullable();
            $table->string('sku')->nullable();
            $table->boolean('is_default')->nullable()->default(false);
            $table->boolean('is_single')->nullable()->default(false);
            // Store all attributes as JSON
            $table->json('attrs')->nullable(); // {"color": "red", "storage": "32GB"}
            $table->unique(['sku','product_id']);
            $table->timestamps();
            
    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products_variants');
    }
};
