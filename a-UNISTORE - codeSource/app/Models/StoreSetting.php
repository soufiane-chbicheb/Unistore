<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    use HasFactory, \App\Traits\BelongsToStore;
    protected $guarded  = [];

    protected $casts = [
        'value' => 'array'
    ];
}
