<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function index()
    {
        $zones = ShippingZone::with('cities')->get();
        return Inertia::render('admin/pages/shipping/ShippingManagement', [
            'zones' => $zones
        ]);
    }

    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:fixed,calculated',
            'price' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        ShippingZone::create($validated);

        return redirect()->back()->with('success', 'Shipping zone created successfully');
    }

    public function updateZone(Request $request, ShippingZone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:fixed,calculated',
            'price' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $zone->update($validated);

        return redirect()->back()->with('success', 'Shipping zone updated successfully');
    }

    public function destroyZone(ShippingZone $zone)
    {
        $zone->delete();
        return redirect()->back()->with('success', 'Shipping zone deleted successfully');
    }

    public function storeCity(Request $request)
    {
        $validated = $request->validate([
            'shipping_zone_id' => 'required|exists:shipping_zones,id',
            'city' => 'required|string|max:255|unique:shipping_zone_cities,city',
        ]);

        ShippingZoneCity::create($validated);

        return redirect()->back()->with('success', 'City added to zone successfully');
    }

    public function destroyCity(ShippingZoneCity $city)
    {
        $city->delete();
        return redirect()->back()->with('success', 'City removed from zone successfully');
    }
}
