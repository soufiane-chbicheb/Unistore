<?php

namespace App\Providers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Observers\OrderObserver;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */

    public function boot(): void
    {

        Order::observe(OrderObserver::class);
        Vite::prefetch(concurrency: 3);

     

        // morphs aliases
        // sortable -  mediable
        Relation::enforceMorphMap([
            'promotion' => 'App\Models\Promotion',
            'product' => 'App\Models\Product',
            'variant' => 'App\Models\ProductVariant',
            'user' => 'App\Models\User',
            'banner' => 'App\Models\Banner',
            'product_collection' => 'App\Models\RuleBasedCollection',
        ]);

    }
}
