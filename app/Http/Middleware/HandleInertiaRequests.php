<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = \App\Models\StoreSetting::all()->pluck('value', 'key')->toArray();
        
        $user = $request->user();
        \Log::debug('Inertia Share Auth', [
            'has_user' => !!$user,
            'user_id' => $user ? $user->id : null,
            'session_id' => $request->session()->getId(),
        ]);
        
        return [
            ...parent::share($request),
            'ziggy' => function () use ($request, $user) {
                $tenant = $request->route('tenant') ?? ($user?->store?->domain ?? $request->getHost());

                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                    'defaults' => [
                        'tenant' => $tenant,
                    ],
                ]);
            },
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles') : null,
            ],
            'flash' => [
                'client_secret' => session('client_secret'),
                'order_id'      => session('order_id'),
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'errors'  => $request->session()->get('errors'), 
            ],
            'storeConfigs' => [
                'store_theme_style' => $settings['store_theme_style'] ?? 'softPastel',
                'store_layout_style' => $settings['store_layout_style'] ?? 'grid',
                'store_card_config' => isset($settings['store_card_config']) ? $settings['store_card_config'] : [
                    'cardId' => 'card-6',
                    'showPrice' => true,
                    'showRating' => true,
                    'showBorder' => true,
                    'isRounded' => true,
                ],
                'admin_theme_style' => $settings['admin_theme_style'] ?? 'luxuryNoir',
            ],
            'cartCount' => $request->user() ? Cart::where('user_id', $request->user()->id)->sum('quantity') : 0,
            'cartItems' => $request->user() ? app(\App\Services\CartService::class)->getCartItems(false) : [],
            'storeCurrency' => app(\App\Services\StoreSettingService::class)->getStoreCurrency(),
        ];
    }
}
