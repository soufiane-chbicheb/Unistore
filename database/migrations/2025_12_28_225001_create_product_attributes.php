<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * this iss for variants 
     */
    public function up(): void
    {
        Schema::create('product_attributes', function (Blueprint $table) {
        $table->id();
        $table->string('key')->comment("material");
        $table->json("values")->comment("e.g material has ['coton' , 'other stuff']");
        $table->timestamps();
        $table->unique(['key']);
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attribute');
    }
};
