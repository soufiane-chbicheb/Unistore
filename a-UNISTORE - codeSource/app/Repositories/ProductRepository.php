<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ProductRepository
{
    public function getTopSellingProducts($startDate, $endDate, $limit = 5)
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.order_status', 'delivered')
            ->select(
                'products.id',
                'products.name', 
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get();
    }
}
