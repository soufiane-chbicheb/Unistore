<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function overview(Request $request)
    {
        $period = $request->get('period', '30d');
        $data = $this->dashboardService->getOverviewData($period);

        return Inertia::render("admin/pages/dashboard/Overview", [
            'kpis' => $data['kpis'],
            'charts' => $data['charts'],
            'top_products' => $data['top_products'],
            'recent_orders' => $data['recent_orders'],
            'period' => $data['period'],
        ]);
    }

    public function salesIndex(Request $request)
    {
        $period = $request->get('period', '30d');
        $data = $this->dashboardService->getSalesAnalyticsData($period);

        return Inertia::render("admin/pages/dashboard/SalesAnalytics", [
            'kpis' => $data['kpis'],
            'charts' => $data['charts'],
            'top_products' => $data['top_products'],
            'period' => $data['period'],
        ]);
    }

    public function customerIndex(Request $request)
    {
        $period = $request->get('period', '30d');
        $data = $this->dashboardService->getCustomerAnalyticsData($period);

        return Inertia::render("admin/pages/dashboard/CustomerAnalytics", [
            'kpis' => $data['kpis'],
            'charts' => $data['charts'],
            'top_spenders' => $data['top_spenders'],
            'period' => $data['period'],
        ]);
    }

    public function inventoryIndex(Request $request)
    {
        $period = $request->get('period', '30d');
        // We'll need a method in DashboardService for inventory data
        $data = $this->dashboardService->getInventoryAnalyticsData($period);

        return Inertia::render("admin/pages/dashboard/Inventory", [
            'products' => $data['products'],
            'stats' => $data['stats'],
            'charts' => $data['charts'],
            'period' => $data['period'],
        ]);
    }
}
