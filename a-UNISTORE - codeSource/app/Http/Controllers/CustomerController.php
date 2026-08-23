<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? 'N/A', // Assuming phone exists or defaults
                    'totalOrders' => $user->orders_count,
                    'totalSpent' => $user->orders()->sum('total_amount'), 
                    'lastOrderDate' => $user->orders()->latest()->first()?->created_at->format('Y-m-d') ?? 'N/A',
                    'status' => 'active', // Placeholder logic
                    'joinedDate' => $user->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/pages/customers/CustomersManager', [
            'customers' => $customers
        ]);
    }

    public function show($id)
    {
        $user = User::with(['orders', 'avatar'])->findOrFail($id);
        
        $customerData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? 'N/A',
            'address' => $user->address ?? 'N/A', // Assuming address exists
            'status' => 'Active',
            'memberSince' => $user->created_at->format('Y'),
            'totalOrders' => $user->orders()->count(),
            'totalSpent' => $user->orders()->sum('total_amount'),
            'recentOrders' => $user->orders()->latest()->limit(5)->get(),
            'avatarUrl' => $user->avatar?->url ?? null,
            'primaryInterest' => null,
            'allInterests' => [],
            'importantNotes' => [],
            'roles' => $user->roles,
        ];

        return Inertia::render('admin/pages/customers/CustomerDetails', [
            'customer' => $customerData,
            'allRoles' => Role::all(),
        ]);
    }
}
