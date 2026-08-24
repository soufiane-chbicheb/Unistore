<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BannerSlot extends Model
{
    protected $fillable = [
        'banner_id',
        'slot_key',
        'is_visible',
        'width',
        'bg_color',
        'main_media_id',
        'secondary_media_id',
        'elements',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'width'      => 'integer',
        'elements'   => 'json',
    ];

    /**
     * Relationship to the Parent Banner
     */
    public function banner(): BelongsTo
    {
        return $this->belongsTo(Banner::class);
    }

    /**
     * Relationship to the Top/Primary Image
     */

    public function mainMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'main_media_id');
    }

    /**
     * Relationship to the Bottom/Secondary Image
     */
    public function secondaryMedia(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'secondary_media_id');
    }
    
}