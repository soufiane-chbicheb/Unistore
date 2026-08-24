<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class TaxService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    public function calculate(float $amount): float
    {
        
        $settings = DB::table('store_settings')
        ->whereIn('key', ['tva_enabled', 'tva_rate'])
        ->pluck('value', 'key');

       if ($settings['tva_enabled'] !== 'true') return 0.0;

       return round($amount * ((float)$settings['tva_rate'] / 100), 2);
    }


}
