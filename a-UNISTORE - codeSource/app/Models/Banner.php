<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use \App\Traits\BelongsToStore;
   
    protected $fillable = [
        'store_id',
        'key',
        'slug',
        'name',
        'direction',
        'aspect_ratio',
        'border_radius',
        'bg_color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function slots(){
        return $this->hasMany(BannerSlot::class);
    }

    public function homeLayoutOrcs()
    {
       return $this->morphMany(HomeLayoutOrc::class, 'sortable');
    }
}
