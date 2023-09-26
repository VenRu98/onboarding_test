<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class RefreshController extends Controller
{
    public function refresh()
    {
        Artisan::call("route:cache");
        Artisan::call("config:cache");
        Artisan::call("view:cache");
        Artisan::call("cache:clear");
        Artisan::call("optimize");
    }
}
