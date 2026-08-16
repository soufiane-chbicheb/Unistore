<?php

namespace App\Providers;

use Google_Client;
use Google_Service_Drive;
use Google_Service_Sheets;
use Illuminate\Support\ServiceProvider;

class GoogleServiceClientProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('googleApp' , function($app){
            $client = new Google_Client() ;
            $clientId = config('googleDrive.client_id');
            $clientSecret = config('googleDrive.client_secret');
            
            if ($clientId) {
                $client->setClientId($clientId);
            }
            if ($clientSecret) {
                $client->setClientSecret($clientSecret);
            }

            $client->setScopes([
                Google_Service_Drive::DRIVE_FILE,
                Google_Service_Sheets::SPREADSHEETS
            ]);
            $client->setAccessType('offline');
            $client->setPrompt('consent');
            $client->setRedirectUri('http://localhost:8000/sheetAuth/google/callback');
            $httpClient = new \GuzzleHttp\Client(['verify' => false]);
            $client->setHttpClient($httpClient);
            
            return $client;
        }) ;
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
