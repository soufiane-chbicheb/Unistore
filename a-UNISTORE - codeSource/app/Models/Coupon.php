<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    /** @use HasFactory<\Database\Factories\CouponFactory> */
    use HasFactory, \App\Traits\BelongsToStore;
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $guarded = [];
    protected $casts = [
        'applicable_product_ids'  => 'array',
        'applicable_category_ids' => 'array',
        'applicable_sub_category_ids' => 'array'
    ];
}
