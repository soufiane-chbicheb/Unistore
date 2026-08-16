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
      Schema::create('banner_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banner_id')->constrained()->onDelete('cascade');
            
            $table->enum('slot_key', ['left', 'middle', 'right'])->index();
            
            $table->boolean('is_visible')->default(true);
            $table->enum('width', ['0' , '35', '50', '65', '100'])->default('35');
            $table->string('bg_color')->nullable();
            
            $table->foreignId('main_media_id')
                ->nullable()
                ->constrained('media')
                ->onDelete('set null');

            $table->foreignId('secondary_media_id')
                ->nullable()
                ->constrained('media')
                ->onDelete('set null');

            $table->json('elements')->nullable();

            $table->timestamps();
            $table->unique(['banner_id', 'slot_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_slots');
    }
};
