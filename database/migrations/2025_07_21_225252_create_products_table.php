<?php

use App\Models\Category;
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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name')->nullable();        // user might not fill yet
            $table->string('slug')->nullable();        // user might not fill yet
            $table->string('brand')->nullable();       // optional in draft
            $table->text('description')->nullable();   // optional in draft
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_visible')->default(true);
            // status and tracking progress
            $table->enum('status', ['draft','published'])->default('draft');
            $table->boolean('ready_to_publish')->default(false);
            $table->unsignedBigInteger('quality_score')->default(0);
            // Ratings
            $table->float('rating_average', 3, 2)->nullable()->default(null); // average rating
            $table->unsignedInteger('rating_count')->default(0);
           
            $table->json('shipping')->nullable();
            $table->json('product_attributes')->nullable(); 
            $table->json('inventory')->nullable();
            $table->json('meta')->nullable();
            $table->json('vendor')->nullable();
            $table->string('madeCountry')->nullable() ;
            $table->string('releaseDate')->nullable() ;
            // Relational / foreign keys
            $table->foreignIdFor(Category::class , 'category_niche_id')
            ->nullable()
            ->default(null)
            ->constrained('categories')
            ->nullOnDelete();
            $table->foreignId('badge_id')->nullable()->constrained("badges")->nullOnDelete();      // "New", "Hot", "Sale"
            $table->boolean('allow_backorder')->default(false); // sell when out of stock?
            $table->boolean('show_countdown')->default(true);  // has active promotion timer?
            $table->boolean('show_reviews')->default(true);  // has active promotion timer?
            $table->boolean('show_related_products')->default(true);  // has active promotion timer?
            $table->boolean('show_social_share')->default(true);  // has active promotion timer?

            $table->json('faqs')->nullable();              // product specific Q&A
            $table->json('related_product_ids')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['store_id', 'slug']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
