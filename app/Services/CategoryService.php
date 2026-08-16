<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Promotion;
use App\Services\Discount\CouponService;
use App\Services\Discount\PromotionService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class CategoryService
{
    
    
    public function getAllCats(CouponService $couponService , PromotionService $promotionService){
        $subs = Category::whereNotNull("parent_id")->with('parent' )->get();
        $nichs = Category::whereNull("parent_id")->with('childrens')->get();
        $allCoupons =  $couponService->getDbCoupons();
        $allPromotions =  $promotionService->getDbPromotions();
       return collect($subs)->merge($nichs)->map(function($cat) use($allCoupons , $allPromotions){
            $collumn = $cat->parent_id ? "applicable_sub_category_ids" : "applicable_category_ids" ;
            $cat->coupons = $allCoupons->filter(function($c) use ($cat , $collumn){
                return in_array($cat->id , $c->$collumn ?? []);
            });

           $cat->promotions = $allPromotions;

            return $cat ;
        });
        
    } 
    public function get_niche_cats(){
        return  Category::where('parent_id' , null)->get(['id' , 'name']) ;
    }

   
    public function storeCategory(array $data): Category {
        return Category::updateOrCreate(
        [
            'id'      => $data['id'] ?? null,
        ]
            ,
        [
            'name'      => $data['name'],
            'parent_id' => $data['parent_id'] ?? null,
            'description' => $data['description'] ?? null,
            'slug'      => Str::slug($data['name']),
        ]);
    }

    public function update(int $id, array $data): Category {
        $category = Category::findOrFail($id);
        $category->update([
            'name'      => $data['name'] ?? $category->name,
            'slug'      => isset($data['name']) ? str($data['name'])->slug() : $category->slug,
            'parent_id' => $data['parent_id'] ?? $category->parent_id,
        ]);
        return $category;
    }

    public function delete(int $id): void {
        Category::findOrFail($id)->delete();
    }
}
