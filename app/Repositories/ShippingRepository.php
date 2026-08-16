<?php

namespace App\Repositories;

use App\Models\ShippingZoneCity;
use Illuminate\Support\Collection;

class ShippingRepository 
{
    public function getCity(string $city){
        return ShippingZoneCity::where("city" , $city)
            ->whereHas('shipping_zone') // This will apply the BelongsToStore global scope on shipping_zone
            ->first();
    }

}