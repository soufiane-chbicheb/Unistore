<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
 {
    use HasFactory, \App\Traits\BelongsToStore;
    protected $guarded = [];
    public function cities()
    {
        return $this->hasMany(ShippingZoneCity::class);

    }

}
