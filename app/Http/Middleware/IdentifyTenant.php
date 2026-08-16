<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\URL ;

class IdentifyTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        
        // Skip identification if we are on a known central domain
        if (in_array($host, ['localhost', 'lvh.me'])) {
            if (session()->has('store_id')) {
                session()->forget('store_id');
            }
            return $next($request);
        }

        // Find the store by its unique domain signature
        $store = Store::where('domain', $host)->first();
        
        if ($store) {
            $request->attributes->set('tenant_store', $store);
            
            // Set session data. IdentifyTenant runs after StartSession (in append),
            // so we can safely use the session helper here.
            session(['store_id' => $store->id]);
            
            // Set global URL default for Laravel and Ziggy
            URL::defaults(['tenant' => $host]);
            
            \Log::debug('Tenant Identified', [
                'host' => $host,
                'store_id' => $store->id,
                'session_id' => $request->session()->getId(),
                'user_id' => $request->user() ? $request->user()->id : 'Guest'
            ]);
        } else {
            // Clear store_id if not on a tenant domain to prevent context leaking
            if (session()->has('store_id')) {
                session()->forget('store_id');
            }

            if (str_ends_with($host, ".lvh.me") || str_ends_with($host, ".unistore.test")) {
                abort(404);
            }
        }

        return $next($request);
    }
}
