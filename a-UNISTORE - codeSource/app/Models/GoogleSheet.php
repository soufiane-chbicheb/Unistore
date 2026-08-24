<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleSheet extends Model
{
    use \App\Traits\BelongsToStore;
   
    // allow mass assignment
    protected $guarded = [];
}
