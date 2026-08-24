<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\MarketplaceRepository;

class MarketplaceService
{
    public function __construct(private MarketplaceRepository $marketplaceRepository) {}

    public function getMarketplaceData(array $filters)
    {
        $products = $this->marketplaceRepository->getMarketplaceProducts($filters);
        $priceRange = $this->marketplaceRepository->getPriceRange();
        $categories = $this->marketplaceRepository->getCategoriesWithCount();
        $brands = $this->marketplaceRepository->getBrands();

        return [
            'products' => $products,
            'priceRange' => $priceRange,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $filters,
        ];
    }
}
