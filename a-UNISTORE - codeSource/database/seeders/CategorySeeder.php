<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    private $categeries = [
       "fashion"
        , "electronics"
        , "beauty"
        , "perfumes"
        , "home"
        , "sports"
        , "toys"
        , "jewelry"
        , "baby"
    ];
    
    private $subCategories = [
        "fashion" => [
            "men",
            "women",
            "kids",
            "shoes",
            "bags",
            "accessories",
            "streetwear",
            "formal"
        ],

        "electronics" => [
            "smartphones",
            "laptops",
            "tablets",
            "audio",
            "gaming",
            "wearables",
            "accessories",
            "cameras"
        ],

        "beauty" => [
            "skincare",
            "makeup",
            "haircare",
            "tools",
            "nails",
            "bath_body",
            "organic"
        ],

        "perfumes" => [
            "men",
            "women",
            "unisex",
            "gift_sets",
            "luxury",
            "miniatures"
        ],

        "home" => [
            "furniture",
            "decor",
            "kitchen",
            "bed_bath",
            "lighting",
            "storage",
            "cleaning"
        ],

        "sports" => [
            "fitness",
            "outdoor",
            "team_sports",
            "running",
            "cycling",
            "yoga",
            "equipment"
        ],

        "toys" => [
            "educational",
            "action_figures",
            "board_games",
            "puzzles",
            "plush",
            "remote_control",
            "outdoor"
        ],

        "jewelry" => [
            "rings",
            "necklaces",
            "bracelets",
            "earrings",
            "watches",
            "luxury",
            "custom"
        ],

        "baby" => [
            "clothing",
            "feeding",
            "diapers",
            "toys",
            "strollers",
            "safety",
            "bath"
        ]
    ];

    
     public function run(): void
    {
        $storeId = Store::first()->id;

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Category::query()->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        foreach($this->categeries as $c){
            $cat = Category::firstOrCreate([
                'name' => $c,
                'slug' => Str::slug($c),
                'parent_id' => null ,
                'store_id' => $storeId,
            ]);
            foreach($this->subCategories[$c] as $sub){
                Category::firstOrCreate([
                    'name' => $sub,
                    'slug' => Str::slug($sub),
                    'parent_id' => $cat->id ,
                    'store_id' => $storeId,
               ]);
            } ;
            
        };
    }
}
