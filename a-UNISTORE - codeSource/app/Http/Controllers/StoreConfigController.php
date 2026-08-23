<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreConfigController extends Controller
{
    public function index() {
        return redirect()->route('store.theme');
    }
    

    public function theme() {
        return Inertia::render("admin/pages/store/ThemeConfigPage");
    }

    public function cards() {
        return Inertia::render("admin/pages/store/CardsConfigPage");
    }

    public function update(Request $request) {
        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'required',
        ]);

        $value = is_array($validated['value']) ? $validated['value'] : $validated['value'];

        \App\Models\StoreSetting::updateOrCreate(
            [
                'key' => $validated['key'],
                'store_id' => session('store_id')
            ],
            ['value' => $value]
        );

        return back()->with('success', 'Setting updated successfully');
    }
}
