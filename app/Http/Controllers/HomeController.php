<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use App\Services\HomeFeedService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(HomeFeedService $feedService)
    {
        $heroSlider = Slider::where('is_active', true)->with('slides')->first();
        $feed = $feedService->getFeed();

        return Inertia::render('Home/HomePage', [
            'feed' => $feed,
            'heroSlider' => $heroSlider,
        ]);
    }
}
