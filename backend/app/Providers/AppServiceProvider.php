<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Auth\Notifications\ResetPassword;

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
        // Fix for MySQL key length error
        Schema::defaultStringLength(191);

        // Customize password reset URL to point to frontend
        // Encode email into the token so URL doesn't need email parameter
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $combinedToken = $token . '|' . base64_encode($user->email);
            return config('app.frontend_url') . '/reset-password?token=' . urlencode($combinedToken);
        });
    }
}
