<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    /** @use HasFactory<\Database\Factories\MaterialFactory> */
    use HasFactory, \App\Traits\BelongsToStore;
    protected $fillable = ['name', 'slug', 'store_id'];

    public  function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function products()
    {
        return $this->hasManyThrough(Product::class, Inventory::class, 'material_id', 'id', 'id', 'product_id');
    }
}
