<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResources;
use App\Services\MarketplaceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function __construct(private MarketplaceService $marketplaceService) {}

    public function index()
    {
        $filters = request()->only(['search', 'category', 'min_price', 'max_price', 'rating', 'sort', 'in_stock', 'brand', 'is_featured', 'source']);
        $data = $this->marketplaceService->getMarketplaceData($filters);

        return Inertia::render('marketplace/index', [
            'products' => ProductResources::collection($data['products']),
            'categories' => $data['categories'],
            'priceRange' => $data['priceRange'],
            'brands' => $data['brands'],
            'filters' => $data['filters'],
        ]);
    }
}
