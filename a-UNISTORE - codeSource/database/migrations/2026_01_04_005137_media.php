<?php

use App\Models\Inventory;
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
   
    Schema::create('media', function (Blueprint $table) {
        $table->id();

        $table->enum('collection' , ['gallery' , 'thumbnail' ,  'avatar', 'banner'])->nullable();
        // thumbnail, gallery, avatar, variant_cover, banner
        $table->string('url');
        
        $table->string('disk')->nullable()->default('public');
        
        $table->enum('media_type' , ['iframe' , 'image' , 'video'])->nullable(); // image, video, document
        $table->string('mediaable_type')->nullable();
        $table->unsignedBigInteger('mediaable_id')->nullable();
        $table->unsignedBigInteger('size')->nullable();
        $table->unsignedInteger('width')->nullable();
        $table->unsignedInteger('height')->nullable();

        $table->boolean('is_temporary')->default(true);
        $table->integer('order')->nullable()->default(0);
        $table->timestamps();

        $table->index(['is_temporary', 'collection']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
