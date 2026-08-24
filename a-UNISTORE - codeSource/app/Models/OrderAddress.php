<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderAddress extends Model
{
    use HasFactory ;
    protected $hidden = [
    "id" ,
    "order_id" ,
    "type" ,
    "created_at" ,
    "updated_at" ,
    ];
    protected $guarded = [];
    public function order(){
        return $this->belongsTo(Order::class) ;
    }
}
