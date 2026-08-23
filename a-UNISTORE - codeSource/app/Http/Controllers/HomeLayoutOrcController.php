<?php

namespace App\Http\Controllers;

use App\Models\HomeLayoutOrc;
use App\Models\Banner;
use App\Models\RuleBasedCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeLayoutOrcController extends Controller
{
    public function index(\App\Services\HomeFeedService $feedService)
    {
        $sections = $feedService->getFeed(true);

        return Inertia::render('admin/pages/store/HomePageOrchestration/HomeEditor', [
            'sections' => $sections
        ]);
    }

    public function publish(Request $request)
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:home_layout_orcs,id',
            'sections.*.order' => 'required|integer',
        ]);

        DB::transaction(function() use ($request) {
            foreach ($request->sections as $sectionData) {
                HomeLayoutOrc::where('id', $sectionData['id'])
                    ->update(['order' => $sectionData['order']]);
            }
        });

        return back()->with('success', 'Home layout updated successfully.');
    }
}
