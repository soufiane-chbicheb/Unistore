<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use \App\Traits\BelongsToStore;

    protected $fillable = ['name', 'color', 'icon', 'store_id'];
}
