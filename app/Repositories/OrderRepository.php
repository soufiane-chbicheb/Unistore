<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OrderRepository
{
    public function getTotalRevenue($startDate, $endDate): float
    {
        return (float) Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('order_status', ['delivered', 'confirmed', 'pending'])
            ->sum('total_amount');
    }

    public function getTotalOrders($startDate, $endDate): int
    {
        return Order::whereBetween('created_at', [$startDate, $endDate])->count();
    }

    public function getRevenueByPaymentMethod($startDate, $endDate)
    {
        return Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('order_status', ['delivered', 'confirmed', 'pending'])
            ->select('payment_method', DB::raw('SUM(total_amount) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->get()
            ->map(function($item) {
                return [
                    'label' => strtoupper($item->payment_method),
                    'total' => (float) $item->total,
                    'count' => (int) $item->count
                ];
            });
    }

    public function getSalesByStatus($startDate, $endDate)
    {
        return Order::whereBetween('created_at', [$startDate, $endDate])
            ->select('order_status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('order_status')
            ->get();
    }

    public function getDeliveredOrdersAnalytics($startDate, $endDate)
    {
        return Order::where('order_status', 'delivered')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function getCustomerLifetimeValue($limit = 10)
    {
        return Order::where('order_status', 'delivered')
            ->select('user_id', DB::raw('SUM(total_amount) as total_spent'), DB::raw('COUNT(*) as orders_count'))
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->with('user:id,name,email')
            ->orderByDesc('total_spent')
            ->limit($limit)
            ->get();
    }

    public function getGeographicalData($startDate, $endDate)
    {
        return DB::table('order_addresses')
            ->join('orders', 'order_addresses.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('order_addresses.type', 'shipping')
            ->select('city', DB::raw('COUNT(*) as orders_count'), DB::raw('SUM(orders.total_amount) as total_revenue'))
            ->groupBy('city')
            ->orderByDesc('orders_count')
            ->get();
    }

    public function getRepeatCustomerRate($startDate, $endDate)
    {
        $customersWithOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('user_id')
            ->select('user_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('user_id')
            ->get();

        $totalCustomers = $customersWithOrders->count();
        $repeatCustomers = $customersWithOrders->where('order_count', '>', 1)->count();

        return $totalCustomers > 0 ? round(($repeatCustomers / $totalCustomers) * 100, 2) : 0;
    }
}
