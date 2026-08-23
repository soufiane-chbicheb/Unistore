<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory, \App\Traits\BelongsToStore;
    protected $fillable = ['name', 'slug', 'store_id'];
    public function products(){
         $this->belongsToMany(Product::class ) ;
    }
}
