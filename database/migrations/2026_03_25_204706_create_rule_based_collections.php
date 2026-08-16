<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rule_based_collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('key');
            $table->string('name'); // e.g., 'deals', 'category'
            $table->string('slug');
            $table->string('icon')->nullable();
            // Core Configs
            $table->json('rules')->nullable();      // Your rules/logic
            $table->json('layout_config')->nullable(); // displayLimit, gap, padding
            $table->json('card_config')->nullable();   // aspectRatio, borderRadius, textAlign
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['store_id', 'key']);
            $table->unique(['store_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rule_based_collections');
    }
};