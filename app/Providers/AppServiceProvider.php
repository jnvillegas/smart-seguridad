<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Treasury\Client;
use App\Observers\ClientObserver;

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
        // Registrar observer
        Client::observe(ClientObserver::class);
    }
}
