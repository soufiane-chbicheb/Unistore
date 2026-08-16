<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreEvent extends Model
{
    /** @use HasFactory<\Database\Factories\StoreEventFactory> */
    use HasFactory, \App\Traits\BelongsToStore;

    protected $fillable = ['store_id', 'event_name', 'payload'];
}
