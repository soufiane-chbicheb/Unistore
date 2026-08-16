<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromotionRequest;
use App\Services\Discount\PromotionService;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;

class PromotionController extends Controller
{
    public function __construct(private PromotionService $promotionService)
    {
    }

    public function index($tenant)
    {
        return Inertia::render('admin/pages/promotions/index', [
            'promotions' => $this->promotionService->getAllPromotions()
        ]);
    }

    public function create($tenant)
    {
        return Inertia::render('admin/pages/promotions/create');
    }

    public function store($tenant, PromotionRequest $request)
    {
        $this->promotionService->createPromotion($request->validated());
        return redirect()->route('promotions.index')->with('success', 'Promotion created successfully');
    }

    public function edit($tenant, $id)
    {
        $promotion = $this->promotionService->getPromotionById($id);
        if (!$promotion) {
            return redirect()->route('promotions.index')->with('error', 'Promotion not found');
        }

        return Inertia::render('admin/pages/promotions/create', [
            'promotion' => $promotion,
        ]);
    }

    public function update($tenant, PromotionRequest $request, $id)
    {
        $this->promotionService->updatePromotion($id, $request->validated());
        return redirect()->route('promotions.index')->with('success', 'Promotion updated successfully');
    }

    public function destroy($tenant, $id)
    {
        $this->promotionService->deletePromotion($id);
        return redirect()->route('promotions.index')->with('success', 'Promotion deleted successfully');
    }
}
