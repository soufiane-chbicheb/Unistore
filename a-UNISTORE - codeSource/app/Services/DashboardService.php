<?php

namespace App\Services;

use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private UserRepository $userRepository
    ) {}

    public function getOverviewData($period = '30d')
    {
        [$currentStart, $currentEnd, $prevStart, $prevEnd] = $this->getPeriodDates($period);

        return [
            'kpis' => [
                'total_revenue' => $this->orderRepository->getTotalRevenue($currentStart, $currentEnd),
                'total_orders' => $this->orderRepository->getTotalOrders($currentStart, $currentEnd),
                'avg_order_value' => $this->calculateAvgOrderValue($currentStart, $currentEnd, $prevStart, $prevEnd)['value'],
            ],
            'charts' => [
                'sales_trend' => $this->orderRepository->getDeliveredOrdersAnalytics($currentStart, $currentEnd),
            ],
            'top_products' => $this->productRepository->getTopSellingProducts($currentStart, $currentEnd),
            'recent_orders' => \App\Models\Order::latest()->limit(5)->with('user:id,name')->get(),
            'period' => $period
        ];
    }

    public function getSalesAnalyticsData($period = '30d')
    {
        [$currentStart, $currentEnd, $prevStart, $prevEnd] = $this->getPeriodDates($period);

        return [
            'kpis' => [
                'total_revenue' => [
                    'value' => $this->orderRepository->getTotalRevenue($currentStart, $currentEnd),
                    'change' => $this->calculatePercentageChange(
                        $this->orderRepository->getTotalRevenue($currentStart, $currentEnd),
                        $this->orderRepository->getTotalRevenue($prevStart, $prevEnd)
                    )
                ],
                'orders_count' => [
                    'value' => $this->orderRepository->getTotalOrders($currentStart, $currentEnd),
                    'change' => $this->calculatePercentageChange(
                        $this->orderRepository->getTotalOrders($currentStart, $currentEnd),
                        $this->orderRepository->getTotalOrders($prevStart, $prevEnd)
                    )
                ],
                'avg_order_value' => $this->calculateAvgOrderValue($currentStart, $currentEnd, $prevStart, $prevEnd),
                'delivered_rate' => $this->calculateDeliveredRate($currentStart, $currentEnd)
            ],
            'charts' => [
                'revenue_over_time' => $this->orderRepository->getDeliveredOrdersAnalytics($currentStart, $currentEnd),
                'payment_methods' => $this->orderRepository->getRevenueByPaymentMethod($currentStart, $currentEnd),
                'order_status' => $this->orderRepository->getSalesByStatus($currentStart, $currentEnd)
            ],
            'top_products' => $this->productRepository->getTopSellingProducts($currentStart, $currentEnd),
            'period' => $period
        ];
    }

    public function getCustomerAnalyticsData($period = '30d')
    {
        [$currentStart, $currentEnd, $prevStart, $prevEnd] = $this->getPeriodDates($period);

        return [
            'kpis' => [
                'total_customers' => [
                    'value' => $this->userRepository->getTotalCustomers($currentStart, $currentEnd),
                    'change' => $this->calculatePercentageChange(
                        $this->userRepository->getTotalCustomers($currentStart, $currentEnd),
                        $this->userRepository->getTotalCustomers($prevStart, $prevEnd)
                    )
                ],
                'repeat_customer_rate' => [
                    'value' => $this->orderRepository->getRepeatCustomerRate($currentStart, $currentEnd),
                    'change' => $this->calculatePercentageChange(
                        $this->orderRepository->getRepeatCustomerRate($currentStart, $currentEnd),
                        $this->orderRepository->getRepeatCustomerRate($prevStart, $prevEnd)
                    )
                ],
                'new_customers_today' => $this->userRepository->getTotalCustomers(now()->startOfDay(), now()->endOfDay()),
            ],
            'charts' => [
                'customer_growth' => $this->userRepository->getCustomerGrowth($currentStart, $currentEnd),
                'registration_methods' => $this->userRepository->getRegistrationMethods(),
                'geographical_distribution' => $this->orderRepository->getGeographicalData($currentStart, $currentEnd),
            ],
            'top_spenders' => $this->orderRepository->getCustomerLifetimeValue(),
            'period' => $period
        ];
    }

    public function getInventoryAnalyticsData($period = '30d')
    {
        [$currentStart, $currentEnd, $prevStart, $prevEnd] = $this->getPeriodDates($period);

        $products = \App\Models\Product::with(['variants' => function($q) {
            $q->select('id', 'product_id', 'stock_quantity', 'sku', 'price');
        }])->get()->map(function($product) {
            $totalStock = $product->variants->sum('stock_quantity');
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category?->name ?? 'Uncategorized',
                'stockQuantity' => $totalStock,
                'sku' => $product->variants->first()?->sku ?? 'N/A',
                'status' => $totalStock == 0 ? 'out-of-stock' : ($totalStock < 20 ? 'low-stock' : 'in-stock'),
            ];
        });

        return [
            'products' => $products,
            'stats' => [
                'total_products' => \App\Models\Product::count(),
                'out_of_stock' => $products->where('status', 'out-of-stock')->count(),
                'low_stock' => $products->where('status', 'low-stock')->count(),
            ],
            'charts' => [
                'stock_by_category' => $products->groupBy('category')->map(function($group, $name) {
                    return ['name' => $name, 'value' => $group->sum('stockQuantity')];
                })->values(),
            ],
            'period' => $period
        ];
    }

    private function calculateAvgOrderValue($currStart, $currEnd, $prevStart, $prevEnd)
    {
        $currRev = $this->orderRepository->getTotalRevenue($currStart, $currEnd);
        $currOrders = $this->orderRepository->getTotalOrders($currStart, $currEnd);
        $currAvg = $currOrders > 0 ? $currRev / $currOrders : 0;

        $prevRev = $this->orderRepository->getTotalRevenue($prevStart, $prevEnd);
        $prevOrders = $this->orderRepository->getTotalOrders($prevStart, $prevEnd);
        $prevAvg = $prevOrders > 0 ? $prevRev / $prevOrders : 0;

        return [
            'value' => $currAvg,
            'change' => $this->calculatePercentageChange($currAvg, $prevAvg)
        ];
    }

    private function calculateDeliveredRate($start, $end)
    {
        $stats = $this->orderRepository->getSalesByStatus($start, $end);
        $total = $stats->sum('count');
        $delivered = $stats->where('order_status', 'delivered')->first()?->count ?? 0;
        return $total > 0 ? round(($delivered / $total) * 100, 2) : 0;
    }

    private function getPeriodDates($period)
    {
        $endDate = now();
        $startDate = match ($period) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            'year' => now()->startOfYear(),
            'all' => Carbon::parse('2024-01-01'),
            default => now()->subDays(30),
        };

        $diff = $startDate->diffInDays($endDate);
        $prevEndDate = $startDate->copy()->subSecond();
        $prevStartDate = $prevEndDate->copy()->subDays($diff);

        return [$startDate, $endDate, $prevStartDate, $prevEndDate];
    }

    private function calculatePercentageChange($current, $previous)
    {
        if ($previous <= 0) return $current > 0 ? 100 : 0;
        return round((($current - $previous) / $previous) * 100, 2);
    }
}
