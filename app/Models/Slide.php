<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    use HasFactory;

    protected $fillable = [
        'slider_id',
        'image_url',
        'tag',
        'title',
        'subtitle',
        'cta_text',
        'cta_link',
        'panel_label',
        'panel_title',
        'panel_bg',
        'order',
    ];

    public function slider()
    {
        return $this->belongsTo(Slider::class);
    }
}
