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
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slider_id')->constrained()->onDelete('cascade');
            $table->string('image_url')->nullable();
            $table->string('tag')->nullable();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->string('panel_label')->nullable();
            $table->string('panel_title')->nullable();
            $table->string('panel_bg')->nullable();
            $table->integer('order')->default(0)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slides');
    }
};
