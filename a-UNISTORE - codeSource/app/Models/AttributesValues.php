<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributesValues extends Model
{   protected $table = 'attribute_values';
    protected $fillable = [
        'attribute_id',
        'name' ,
        'value',
        'meta'
    ];

     protected $hidden = [
        "created_at",
        "updated_at"
    ];

    protected $casts = [
        'meta' => 'array',
    ];

}
