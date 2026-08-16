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
       Schema::create('variants_options_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('variants_options_settings')->cascadeOnDelete();
            $table->enum('type' , ['radio' , 'button'])->nullable();
            $table->string('key');
            $table->string('value')->nullable();
            $table->string('hex')->nullable()->comment("this isonly for color attrs");
            $table->unique(['key','value']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variants_options_settings');
    }
};
