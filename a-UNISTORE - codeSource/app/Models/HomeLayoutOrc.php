<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeLayoutOrc extends Model
{
    use \App\Traits\BelongsToStore;

    protected $fillable = ['store_id', 'sortable_id', 'sortable_type', 'order'];

    public function sortable()
    {
        return $this->morphTo();
    }
}
