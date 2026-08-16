<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory ;
    
    public function product(){
        return $this->belongsTo(Product::class);
    }



    protected $fillable = ['product_id' , 'price','sku' ,'is_single',  'compare_price', 'is_default',  'stock', 'attrs'];
    protected $casts = [
        'attrs' => 'array' , 
    'price' => 'float' , 
    'compare_price' => 'float' , 
    'stock' => 'int' ,
    ] ;

    public function images(){
        return $this->morphMany(Media::class , 'mediaable');
    }
 
}
