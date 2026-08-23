<?php

namespace App\Models;

use Carbon\Cli\Invoker;
use Faker\Core\File;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, \App\Traits\BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'slug',
        'brand',
        'description',
        'is_featured',
        'status',
        'ready_to_publish',
        'quality_score',
        'rating_average',
        'rating_count',
        'shipping',
        'attrs',
        'inventory',
        'meta',
        'vendor',
        'madeCountry',
        'releaseDate',
        'category_niche_id',
        'badge_id',
        'allow_backorder',
        'show_countdown',
        'show_reviews',
        'is_visible',
        'show_related_products',
        'show_social_share',
        'faqs',
        'related_product_ids',
    ];

    protected $hidden = ['created_at', 'updated_at', 'quality_score', 'allow_backorder', 'deleted_at', 'inventory'];

    protected $casts = [
        'inventory' => 'array',
        'shipping' => 'array',
        'video' => 'array',
        'related_products' => 'array',
        'is_featured' => 'boolean',
        'is_visible' => 'boolean',
        'ready_to_publish' => 'boolean',
        'meta' => 'array',
        'vendor' => 'array',
        'faqs' => 'array',
        'related_product_ids' => 'array',
        'product_attributes' => 'array',
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class, 'product_id', 'id');
    }

    public function thumbnail()
    {
        return $this->morphOne(Media::class, 'mediaable')->where('collection', 'thumbnail');
    }

    public function covers()
    {
        return $this->morphMany(Media::class, 'mediaable')
            ->where('collection', 'gallery')
            ->where("media_type", "image");
    }

    public function videos()
    {
        return $this->morphMany(Media::class, 'mediaable')->whereIn('media_type', ['video', 'iframe']);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediaable');
    }

    public function subCategories()
    {
        return $this->belongsToMany(Category::class, 'product_subCategory', 'product_id', 'sub_category_id')
            ->select(['categories.id', 'categories.name']);
    }

    public function nichCategory()
    {
        return $this->belongsTo(Category::class, 'category_niche_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class)
            ->select('tags.id', 'tags.name');
    }

    public function orders()
    {
        return $this->hasManyThrough(OrderItem::class, ProductVariant::class, 'product_id', 'product_variant_id');
    }

    public function promotions()
    {
        return Promotion::where("is_active", true)->get();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function ratingBreakdown()
    {
        return $this->reviews()
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();
    }

    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
