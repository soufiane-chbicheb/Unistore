<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductTest extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        

        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'brand'                 => $this->brand,
            'category_niche_id'     => $this->category_niche_id,
            'sub_categories'        => $this->subCategories->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->name,
            ]),
            'description'           => $this->description,
            'price'                 => $this->price,
            'sku'                   => $this->sku,
            'compare_price'         => $this->compare_price,
            'stock'                 => $this->stock,
            'madeCountry'           => $this->madeCountry,
            'releaseDate'           => $this->releaseDate,
            'video'              => [[
                'media_type' => 'iframe' ,
                'id'=> '1',
                'url' => 'https://www.youtube.com/embed/8scL5oJX6CM'
            ],
            [
                'media_type' => 'iframe' ,
                'id'=> '2',
                'url' => 'https://www.youtube.com/embed/8scL5oJX6CM'
            ]
            ] ,
            'thumbnail'             => $this->thumbnail ? [
                'id'  => $this->thumbnail->id,
                'url' => $this->thumbnail->url,
            ] : null,
            'tags'                  => $this->tags->pluck('name'),
            'covers'                => $this->covers->map(fn($c) => [
                'id'  => $c->id,
                'url' => $c->url,
            ]),
            'isFreeShipping'        => $this->isFreeShipping,
            'isFeatured'            => $this->isFeatured,
            'inventory'             => $this->inventory,
            'shipping'              => $this->shipping,
            'meta'                  => $this->meta,
            'vendor'                => $this->vendor,
            'variants'              =>  [
                [
                  "variant_id" => 1 ,
                   "image" => $this->thumbnail ? [
                        'id'  => $this->thumbnail->id,
                        'url' => $this->thumbnail->url,
                    ] : null,
                   "sku" => 'test sku' , 
                   "price" => 45,
                   "compare_price" => 60,
                   "stock" => 10,
                   "is_open" => false , 
                   "attrs" => [
                     'size' =>  "M",
                     'color' => [
                         "name" => "Pink" ,
                         "hex" => "#c616cfff"
                     ],
             
                   ]
                ],
               
            ],
            'product_attributes'    => $this->productAttributes ?? [],
            'related_products'      => $this->relatedProducts ?? [],
            'faqs'                  => $this->faqs,
            'badge_text'            => $this->badge_text,
            'show_countdown'        => $this->show_countdown,
            'show_related_products' => $this->show_related_products,
            'show_reviews'          => $this->show_reviews,
            'show_social_share'     => $this->show_social_share,
            'allow_backorder'       => false,
            'promotion_ids'         => $this->promotions ?? [1,2,3,4,5,6,7,8],
            'coupon_ids'            => $this->coupons ?? [1,3,4,5,6,7,8],
        ];
    }
}