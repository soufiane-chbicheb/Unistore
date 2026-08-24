<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        $socialite = app('Laravel\Socialite\Contracts\Factory');
        $httpClient = new \GuzzleHttp\Client(['verify' => false]);
        
        return $socialite->driver('google-login')
            ->setHttpClient($httpClient)
            ->stateless()
            ->redirect();

    }
    
    public function callback(Request $request)
    {
        try {
            $socialite = app('Laravel\Socialite\Contracts\Factory');
            $httpClient = new \GuzzleHttp\Client(['verify' => false]);
            Log::info('Google Auth: Callback received');
            
            $googleUser = $socialite->driver('google-login')
                ->setHttpClient($httpClient)
                ->stateless()
                ->user();
                
            Log::info('Google Auth: Google user retrieved', ['email' => $googleUser->email]);
            
            $user = User::withoutGlobalScopes()->where('email', $googleUser->email)->first();
            
            if ($user) {
                Log::info('Google Auth: User already exists, updating google_id');
                $user->update(['google_id' => $googleUser->id]);
            } else {
                Log::info('Google Auth: Creating new user');
                $user = User::withoutGlobalScopes()->create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(16)),
                    'email_verified_at' => now(),
                ]);
            }
            
            Log::info('Google Auth: Logging in user');
            Auth::login($user, true); // Added true for remember me
            $request->session()->regenerate();
            event(new \App\Events\UserLogin('auth', $user, true));
            Log::info('Google Auth: User logged in, session regenerated, and event dispatched');

            $host  = $request->getHost();
            $intendedUrl = null;
            

            if(str_ends_with($host,'.lvh.me') || str_ends_with($host, '.localhost')){
                $domain =    $user->store()?->domain ?? $host;
                $intendedUrl =  $domain . "/";
            }else{

                $intendedUrl = session()->pull('url.intended', '/');
            }


            Log::info('Google Auth: Redirecting to intended URL', ['url' => $intendedUrl]);
            
            return redirect()->intended($intendedUrl);
            
        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('Google Auth: InvalidStateException: ' . $e->getMessage());
            return $this->redirectToLogin();
            
        } catch (\Exception $e) {
            Log::error('Google Auth: Error: ' . $e->getMessage());
            Log::error('Google Auth: Stack trace: ' . $e->getTraceAsString());
            return $this->redirectToLogin();
        }
    }

    private function redirectToLogin()
    {
        return redirect('/login');
    }
}