<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory, \App\Traits\BelongsToStore;
    protected $fillable = ['user_id' , 'product_id', 'text' , 'rating', 'store_id'];
    protected  $hidden =["updated_at" , "created_at"] ;
    public function product()  {
        return $this->belongsTo(Product::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    

}
