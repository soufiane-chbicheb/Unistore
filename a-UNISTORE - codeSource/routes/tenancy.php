<?php

use App\Http\Controllers\Tenancy\StoreController;
use App\Http\Controllers\Tenancy\TenenacyDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




$centralDomains = ['localhost', 'lvh.me'];

foreach ($centralDomains as $domain) {
    Route::domain($domain)->group(function () use ($domain) {
        Route::get('/', [StoreController::class, 'index'])->name('home.tenancy.' . str_replace('.', '_', $domain));
        
        Route::get('/tenancy/dashboard', [TenenacyDashboardController::class , 'index'])->name('tenancy.dashboard.' . str_replace('.', '_', $domain));

        Route::get('/tenancy/stores', function () use ($domain) {
            return Inertia::render('tenancy/stores/Index');
        })->name('tenancy.stores.' . str_replace('.', '_', $domain));

        Route::get('/tenancy/roles', function () use ($domain) {
            return Inertia::render('tenancy/roles/Index');
        })->name('tenancy.roles.' . str_replace('.', '_', $domain));

        // Tenancy Store Creation
        Route::middleware(['auth'])->group(function () use ($domain) {
            Route::get('/tenancy/stores/create', [StoreController::class, 'create'])->name('tenancy.stores.create.' . str_replace('.', '_', $domain));
            Route::post('/tenancy/stores', [StoreController::class, 'store'])->name('tenancy.stores.store.' . str_replace('.', '_', $domain));
        });
    });
}

// Fallback aliases for backward compatibility if needed by route() helper without suffix
Route::group([], function() {
    Route::get('/tenancy/stores/create', [StoreController::class, 'create'])->name('tenancy.stores.create');
    Route::post('/tenancy/stores', [StoreController::class, 'store'])->name('tenancy.stores.store');
});
