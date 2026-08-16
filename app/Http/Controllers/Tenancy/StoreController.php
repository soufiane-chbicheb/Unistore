<?php

namespace App\Http\Controllers\Tenancy;

use App\Events\NewStoreCreation;
use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    /**
     * Display the central landing page or the store home page.
     */
    public function index(Request $request)
    {
        // If the middleware identified a store, we are in a tenant context
        if ($request->attributes->has('tenant_store')) {
            // This is a store domain, show the shop front
            return redirect()->route("dashboard.overview");
        }

        return Inertia::render('landingpage/Home');
        // return Inertia::render('tenancy/home');
    }

    /**
     * Show the form for creating a new store.
     */
    
     public function create()
    {
        // Get the last store index to generate default domain
        $lastStore = Store::latest('id')->first();
        $nextIndex = $lastStore ? $lastStore->id + 1 : 1;
        $defaultDomain = "boutique{$nextIndex}.lvh.me";

        return Inertia::render('tenancy/stores/create', [
            'defaultDomain' => $defaultDomain,
            'nextIndex' => $nextIndex
        ]);
    }

    /**
     * Store a newly created store in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'nullable|string|max:255|unique:stores,domain',
            'slug' => 'required|string|max:255|unique:stores,slug',
        ]);
        
        // Fallback for domain if not provided
        if (empty($validated['domain'])) {
            $lastStore = Store::latest('id')->first();
            $nextIndex = $lastStore ? $lastStore->id + 1 : 1;
            $validated['domain'] = "boutique{$nextIndex}.lvh.me";
        }

        // Create the store
        $store = Store::create([
            'name' => $validated['name'],
            'domain' => $validated['domain'],
            'slug' => $validated['slug'],
        ]);

        // set default store config
        event(new NewStoreCreation($store));
        // Link current user to this store and make them super_admin
        $user = Auth::user();
        $user->store_id = $store->id;
        $user->save();

        // Assign super_admin role
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $user->roles()->syncWithoutDetaching([$superAdminRole->id]);
        }

        // Build the full URL for the new store's admin dashboard
        $scheme = $request->getScheme();
        $port = $request->getPort();
        $fullUrl = "{$scheme}://{$store->domain}" . ($port ? ":{$port}" : "") . "/dashboard";

        // For Inertia, a full page redirect to a different domain requires Inertia::location
        return Inertia::location($fullUrl);
    }
}
