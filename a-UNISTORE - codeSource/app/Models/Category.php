<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory, \App\Traits\BelongsToStore;

    protected $fillable = ['name' , 'slug', 'store_id', 'parent_id', 'is_active', 'description'];

    public function products(){
          return $this->hasMany(Product::class, 'category_niche_id');
    }

    public function parent(){
        return $this->belongsTo(Category::class  , 'parent_id') ;
    }
    public function childrens(){
        return $this->hasMany(Category::class  , 'parent_id') ;
    }

    public function coupons(){
        $query = Coupon::query() ;
        if($this->parent_id){
           $query->whereJsonContains('applicable_sub_category_ids' , $this->id) ;
        }else{
           $query->whereJsonContains('applicable_category_ids' , $this->id) ;
        }
        return $query->get();
    }
    public function promotions(){
        return Promotion::where('is_active', true)->get();
    }

}
