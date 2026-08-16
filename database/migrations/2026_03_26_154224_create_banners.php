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
      Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('key')->index();
            $table->string('slug')->nullable();
            $table->string('name');
            $table->integer('order')->default(0)->index();
            $table->string('direction', 3)->default('ltr'); // 'ltr' or 'rtl'
            $table->string('aspect_ratio')->default('21:9');
            $table->string('border_radius')->default('12px');
            $table->string('bg_color')->default('#ffffff');

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['store_id', 'key']);
            $table->unique(['store_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
