<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserRepository
{
    public function getTotalCustomers($startDate, $endDate): int
    {
        return User::whereBetween('created_at', [$startDate, $endDate])->count();
    }

    public function getCustomerGrowth($startDate, $endDate)
    {
        return User::whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    public function getRegistrationMethods()
    {
        return User::select(
            DB::raw('CASE WHEN google_id IS NOT NULL THEN "Google" ELSE "Email" END as method'),
            DB::raw('COUNT(*) as count')
        )
        ->groupBy('method')
        ->get();
    }

    public function getActiveCustomers($limit = 10)
    {
        return User::withCount('orders')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->get();
    }
}
