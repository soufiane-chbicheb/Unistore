<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\User;

class CurstomerController extends Controller
{
    public function index () {
        $customers = User::has('orders')
            ->whereDoesntHave('roles', function($query) {
                $query->whereIn('name', ['admin', 'super admin']);
            })
            ->withCount('orders')
            ->with('avatar')
            ->get();

        return Inertia::render('admin/pages/customers/CustomersManager', [
            'customers' => $customers
        ]) ; 
    }



     public function show () {
        return Inertia::render('admin/pages/customers/CustomerDetails') ; 
    }

}
