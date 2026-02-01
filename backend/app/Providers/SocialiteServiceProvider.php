<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client;

class SocialiteServiceProvider extends ServiceProvider
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
        // Only disable SSL verification in local development
        if ($this->app->environment('local')) {
            $client = new Client([
                'verify' => false,
            ]);

            Socialite::driver('google')->setHttpClient($client);
        }
    }
}
