<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;

class SocialiteProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Register "google-login" as a Google driver
        Socialite::extend('google-login', function ($app) {
            $config = $app['config']['services.google-login'];
            
            // Load from JSON if configured and file exists
            $jsonPath = config('googleAuth.oauth_auth_credentials_path');
            if ($jsonPath && file_exists($jsonPath)) {
                $credentials = json_decode(file_get_contents($jsonPath), true);
                if (isset($credentials['web'])) {
                    $config['client_id'] = $credentials['web']['client_id'];
                    $config['client_secret'] = $credentials['web']['client_secret'];
                    $config['redirect'] = config('googleAuth.redirect_uri') ?? ($credentials['web']['redirect_uris'][0] ?? $config['redirect']);
                }
            }

            return Socialite::buildProvider(GoogleProvider::class, $config);
        });

        // Register "google-drive" as another Google driver
        Socialite::extend('google-drive', function ($app) {
            $config = $app['config']['services.google-drive'];
            return Socialite::buildProvider(GoogleProvider::class, $config);
        });
    }
}
