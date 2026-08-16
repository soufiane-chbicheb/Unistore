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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');           // Category name
            $table->text('description')->nullable();           // Category description
            $table->string('slug');
            $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete(); // parentcategory / subcategory
            $table->timestamps();

            $table->unique(['store_id', 'parent_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
