<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class MarketplaceRepository
{
    public function getMarketplaceProducts(array $filters)
    {
        $query = Product::query()
            ->where('status', 'published')
            ->where('is_visible', true)
            ->with(['thumbnail', 'variants.images', 'nichCategory', 'badge'])
            ->withCount('orders');

        // Contextual Source Filtering
        if (!empty($filters['source'])) {
            if ($filters['source'] === 'new_arrivals') {
                $query->latest();
            }
        }

        // Search
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        // Categories
        if (!empty($filters['category'])) {
            $query->where('category_niche_id', $filters['category']);
        }

        // Brands
        if (!empty($filters['brand'])) {
            $brands = is_array($filters['brand']) ? $filters['brand'] : explode(',', $filters['brand']);
            $query->whereIn('brand', $brands);
        }

        // Price Range
        if (isset($filters['min_price']) || isset($filters['max_price'])) {
            $query->whereHas('variants', function ($q) use ($filters) {
                if (isset($filters['min_price'])) {
                    $q->where('price', '>=', $filters['min_price']);
                }
                if (isset($filters['max_price'])) {
                    $q->where('price', '<=', $filters['max_price']);
                }
            });
        }

        // Rating
        if (!empty($filters['rating'])) {
            $query->where('rating_average', '>=', $filters['rating']);
        }

        // In Stock
        if (!empty($filters['in_stock']) && $filters['in_stock'] === 'true') {
            $query->whereHas('variants', function ($q) {
                $q->where('stock', '>', 0);
            });
        }

        // Featured
        if (!empty($filters['is_featured']) && $filters['is_featured'] === 'true') {
            $query->where('is_featured', true);
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'price_low':
                $query->join('product_variants', 'products.id', '=', 'product_variants.product_id')
                    ->where('product_variants.is_default', true)
                    ->orderBy('product_variants.price', 'asc')
                    ->select('products.*');
                break;
            case 'price_high':
                $query->join('product_variants', 'products.id', '=', 'product_variants.product_id')
                    ->where('product_variants.is_default', true)
                    ->orderBy('product_variants.price', 'desc')
                    ->select('products.*');
                break;
            case 'best_rated':
                $query->orderByDesc('rating_average');
                break;
            case 'most_popular':
                $query->orderByDesc('rating_count');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate(12)->withQueryString();
    }

    public function getPriceRange()
    {
        return DB::table('product_variants')
            ->selectRaw('MIN(price) as min, MAX(price) as max')
            ->first();
    }

    public function getCategoriesWithCount()
    {
        return \App\Models\Category::withCount(['products' => function ($q) {
            $q->where('status', 'published')->where('is_visible', true);
        }])->get();
    }

    public function getBrands()
    {
        return Product::where('status', 'published')
            ->whereNotNull('brand')
            ->distinct()
            ->pluck('brand');
    }
}
