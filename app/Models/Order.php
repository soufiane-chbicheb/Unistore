<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use \App\Traits\BelongsToStore ;
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, BelongsToStore;
    protected $fillable = [
        'store_id',
        'order_number',
        'user_id',
        'status',
        'payment_status',
        'order_status' ,
        'coupon_counted',
        'promotion_counted' ,
        'coupon_id' ,
        'promotion_id',
        'tax',
        'payment_id',
        'currency',
        'payment_method',
        'tracking_token',
        'paid_at',
        'shipping_cost',
        'discount_amount',
        'total_amount',
        'notes',
    ];
     protected $hidden = [
      'updated_at'
     ] ;
     protected $casts = [
     ];
    

     public function products(){
        return $this->belongsToMany(Product::class);
     }

      public function user(){
        return $this->belongsTo(User::class);
      }


      public function items(){
        return $this->hasMany(OrderItem::class);
      }


      public function address(){
         return $this->hasOne(OrderAddress::class) ;
      }


      public function coupon(){
         return  $this->belongsTo(Coupon::class);
      }
      


    
}
