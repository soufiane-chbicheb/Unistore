<?php

namespace App\Http\Controllers\Tenancy;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenenacyDashboardController extends Controller
{
    public function index()
    {
                return Inertia::render('tenancy/dashboard/Overview');

    }
}
