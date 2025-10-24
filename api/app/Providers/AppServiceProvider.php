<?php

namespace App\Providers;

use App\Services\JWTService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register JWTService as a singleton
        $this->app->singleton(JWTService::class, function ($app) {
            return new JWTService;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Register custom JWT guard
        Auth::extend('jwt', function ($app, $name, array $config) {
            return new \Illuminate\Auth\TokenGuard(
                Auth::createUserProvider($config['provider']),
                $app->request,
                'token'
            );
        });
    }
}
