<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZoneCity extends Model
{
    use HasFactory ;

    protected $fillable = ['shipping_zone_id', 'city'];

    public function shipping_zone()
    {
        return $this->belongsTo(ShippingZone::class);
    }
    

}
