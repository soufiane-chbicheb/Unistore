<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory, \App\Traits\BelongsToStore;

    protected $fillable = [
        'store_id',
        'name',
        'is_active',
        'autoplay_speed',
        'show_arrows',
        'show_dots',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'show_arrows' => 'boolean',
        'show_dots' => 'boolean',
    ];

    public function slides()
    {
        return $this->hasMany(Slide::class)->orderBy('order');
    }
}
