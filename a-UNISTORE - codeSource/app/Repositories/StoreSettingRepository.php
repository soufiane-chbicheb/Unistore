<?php

namespace App\Repositories;

use App\Models\StoreSetting;

class StoreSettingRepository
{
    public function getByKey(string $key)
    {
        return StoreSetting::where('key', $key)->first();
    }

 
}
