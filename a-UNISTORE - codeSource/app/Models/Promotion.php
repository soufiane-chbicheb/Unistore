<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    /** @use HasFactory<\Database\Factories\PromotionFactory> */
    use HasFactory, \App\Traits\BelongsToStore;
    protected $guarded = [];

    protected $casts = [
        'valid_from'  => 'datetime',
        'valid_until' => 'datetime',
        'is_active'   => 'boolean'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function homeLayoutOrcs()
    {
       return $this->morphMany(HomeLayoutOrc::class, 'sortable');
    }
}
