<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResources extends JsonResource
{
    /**
     * Create a new class instance.
     */
    public static $wrap = null;
    public function toArray(Request $request) 
    {

      $variants = collect($this->whenLoaded("variants") ?? collect([]) )->map(function($v){
        $v->variant_id = $v->id ;
        unset($v->id) ;
        return $v ;
      });

    
      $single = $variants->first(fn($v) => $v->is_default) ?? $variants->first() ?? null ;

      $allImages = collect([]);
      if ($this->thumbnail) {
          $allImages->push($this->thumbnail->url);
      }
      $this->variants->each(function($v) use ($allImages) {
          $v->images->each(function($img) use ($allImages) {
              $allImages->push($img->url);
          });
      });

      $res =  [
            ...parent::toArray($request) ,
            'tags' => $this->tags->pluck('name'),
            "price" => $single ?  $single->price :  0  ,
             "compare_price" =>  $single ?  $single->compare_price :  0 ,
             "originalPrice" =>  $single ?  $single->compare_price :  0 ,
             "stock" =>   $single ? $single->stock :  0 ,
            "sku" =>   $single ? $single->sku : "",
            "variant_id" => $single ? ($single->variant_id ?? $single->id) : null,
            "image" => $this->thumbnail ? $this->thumbnail->url : ($single && $single->images->first() ? $single->images->first()->url : ""),
            "images" => $allImages->unique()->values()->toArray(),
            "category" => $this->nichCategory ? $this->nichCategory->name : "Uncategorized",
            "rating" => $this->rating_average ?? 0,
            "reviews" => $this->rating_count ?? 0,
            "sold_count" => $this->orders_count ?? 0,
            "is_verified" => ($this->quality_score >= 80),
            "variants" => $single ? [] : $variants
        ];

    //   dd($res);
     return $res ;
    }
}
