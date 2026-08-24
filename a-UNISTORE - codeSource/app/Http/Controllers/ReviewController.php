<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user.avatar', 'product.thumbnail'])->latest()->get();
        
        return Inertia::render('admin/pages/reviews/ReviewsList', [
            'reviews' => $reviews
        ]);
    }

    public function pending()
    {
        // Assuming there's a status column, if not we'll just show all for now 
        // or filter by a specific criteria if you have one in mind
        $reviews = Review::with(['user.avatar', 'product.thumbnail'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('admin/pages/reviews/ReviewsList', [
            'reviews' => $reviews,
            'filter' => 'pending'
        ]);
    }
}
