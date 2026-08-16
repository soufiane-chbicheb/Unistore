<?php

namespace App\Http\Resources;

use App\Models\Media;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = null ;
    public function toArray(Request $request): array
    {
        $variants = collect($this->whenLoaded("variants")) ?? collect([])  ;
        $variantsImages = Media::whereIn('mediaable_id' , $variants->pluck("id"))
                             ->where("mediaable_type" , ProductVariant::class)
                             ->where("collection" , "gallery")
                             ->where("media_type" , "image")
                             ->get() ;

        $colors = $variants
                ->filter(function($variant) {
                    return isset($variant->attrs['color']);
                })
                ->map(function ($variant){
                    $colorData = $variant->attrs['color'];
                    return [
                        "variant_id"=> $variant->id,
                        "hex" => is_array($colorData) ? ($colorData['hex'] ?? null) : null ,
                        "name" => is_array($colorData) ? ($colorData['name'] ?? null) : $colorData ,
                    ] ;
                })
                ->unique('name')
                ->values()
                ->toArray()
                ;

        $mappedVariantImages = $variantsImages->map(function(Media $i) use ($variants) {
            $variant = $variants->firstWhere('id', $i->mediaable_id);
            $colorData = $variant->attrs['color'] ?? null;
            return [
                ...$i->toArray(),
                "variant_id" => (int) $i->mediaable_id,
                "color_name" => is_array($colorData) ? ($colorData['name'] ?? null) : $colorData
            ];
        })->toArray();

        return [
            ...Arr::except(parent::toArray($request) , ['thumbnail' , 'vendor' , 'slug' , 'variants' , 'nich_category' , 'sub_categories']),
           "variants" => $variants,
           "covers" => [
             $this->whenLoaded("thumbnail") ,
             ...$this->whenLoaded("covers") ,
             ...$mappedVariantImages,
           ] ,
           "colors" => $colors ,
           "rating_breakdown" => (object) $this->ratingBreakdown() ,
           "promotions" => $this->promotions() , 
        ];
    }
}
