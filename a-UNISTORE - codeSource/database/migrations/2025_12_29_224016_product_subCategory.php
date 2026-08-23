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
       Schema::create('product_subCategory', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('product_id')
            ->constrained('products')
            ->cascadeOnDelete();
        
        $table->foreignId('sub_category_id')
            ->constrained('categories')
            ->cascadeOnDelete();
        
        $table->timestamps();
        
        $table->unique(['product_id', 'sub_category_id']); // prevent duplicates
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('category_product');
    }
};
