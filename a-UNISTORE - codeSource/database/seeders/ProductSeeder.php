<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Badge;
use App\Models\Media;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        Schema::disableForeignKeyConstraints();
        ProductVariant::truncate();
        Product::truncate();
        Media::whereIn('collection', ['thumbnail', 'gallery'])->delete();

        // Get Badges from Badge model
        $new = Badge::where('name', 'New')->first()?->id;
        $featured = Badge::where('name', 'Featured')->first()?->id;
        $hot = Badge::where('name', 'Hot')->first()?->id;
        $sale = Badge::where('name', 'Sale')->first()?->id;

        // Get Categories from Category model
        $men = Category::where('slug', 'men')->first()?->id;
        $women = Category::where('slug', 'women')->first()?->id;
        $shoes = Category::where('slug', 'shoes')->first()?->id;
        $watches = Category::where('slug', 'watches')->first()?->id;

        $productPool = [
            // MEN (id: 2)
            ['name' => 'Classic Leather Jacket', 'brand' => 'Stone & Harbor', 'cat' => $men, 'badge' => $new, 'price' => 299.00, 'img' => 'https://images.pexels.com/photos/1039439/pexels-photo-1039439.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Minimalist Cotton Tee', 'brand' => 'Basic Essentials', 'cat' => $men, 'badge' => $featured, 'price' => 25.00, 'img' => 'https://images.pexels.com/photos/428333/pexels-photo-428333.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Denim Shirt Classic', 'brand' => 'Blue Roots', 'cat' => $men, 'badge' => $sale, 'price' => 45.00, 'img' => 'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Wool Blend Blazer', 'brand' => 'Tailor & Co.', 'cat' => $men, 'badge' => $hot, 'price' => 150.00, 'img' => 'https://images.pexels.com/photos/134482/pexels-photo-134482.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Slim Fit Chinos XL', 'brand' => 'Stone & Harbor', 'cat' => $men, 'badge' => $new, 'price' => 60.00, 'img' => 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Oxford Button Down Pro', 'brand' => 'Stone & Harbor', 'cat' => $men, 'badge' => $featured, 'price' => 55.00, 'img' => 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Cargo Utility Pants Green', 'brand' => 'Blue Roots', 'cat' => $men, 'badge' => $sale, 'price' => 75.00, 'img' => 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Cashmere V-Neck Black', 'brand' => 'Tailor & Co.', 'cat' => $men, 'badge' => $hot, 'price' => 120.00, 'img' => 'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Graphic Street Hoodie Elite', 'brand' => 'Vibe', 'cat' => $men, 'badge' => $new, 'price' => 85.00, 'img' => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Linen Summer Shirt White', 'brand' => 'Basic Essentials', 'cat' => $men, 'badge' => $featured, 'price' => 40.00, 'img' => 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800'],
            
            // WOMEN (id: 3)
            ['name' => 'Silk Evening Gown Lux', 'brand' => 'Élégance', 'cat' => $women, 'badge' => $hot, 'price' => 450.00, 'img' => 'https://images.pexels.com/photos/1103928/pexels-photo-1103928.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Floral Summer Dress Pink', 'brand' => 'Bloom', 'cat' => $women, 'badge' => $new, 'price' => 75.00, 'img' => 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Leather Biker Jacket Edge', 'brand' => 'Rebel Grace', 'cat' => $women, 'badge' => $featured, 'price' => 220.00, 'img' => 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Over-sized Knit Sweater Cozy', 'brand' => 'Hygee', 'cat' => $women, 'badge' => $sale, 'price' => 60.00, 'img' => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Satin Midi Skirt Blue', 'brand' => 'Élégance', 'cat' => $women, 'badge' => $new, 'price' => 85.00, 'img' => 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Boho Chic Blouse White', 'brand' => 'Bloom', 'cat' => $women, 'badge' => $featured, 'price' => 50.00, 'img' => 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'High Waist Tailored Trousers Grey', 'brand' => 'Rebel Grace', 'cat' => $women, 'badge' => $sale, 'price' => 95.00, 'img' => 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Cashmere Wrap Cardigan Soft', 'brand' => 'Hygee', 'cat' => $women, 'badge' => $hot, 'price' => 140.00, 'img' => 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Classic Trench Coat Camel', 'brand' => 'Élégance', 'cat' => $women, 'badge' => $new, 'price' => 180.00, 'img' => 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Embroidered Denim Jacket Blue', 'brand' => 'Bloom', 'cat' => $women, 'badge' => $featured, 'price' => 110.00, 'img' => 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800'],

            // SHOES (id: 5)
            ['name' => 'Cloud Comfort Sneakers White', 'brand' => 'Aero', 'cat' => $shoes, 'badge' => $new, 'price' => 130.00, 'img' => 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Rugged Mountain Boots Brown', 'brand' => 'Peak Performance', 'cat' => $shoes, 'badge' => $hot, 'price' => 185.00, 'img' => 'https://images.pexels.com/photos/1619652/pexels-photo-1619652.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Urban Canvas Lows Black', 'brand' => 'Aero', 'cat' => $shoes, 'badge' => $sale, 'price' => 55.00, 'img' => 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Performance Running Pro Elite', 'brand' => 'Velocity', 'cat' => $shoes, 'badge' => $featured, 'price' => 160.00, 'img' => 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Classic Leather Loafers Tan', 'brand' => 'LuxWalk', 'cat' => $shoes, 'badge' => $new, 'price' => 145.00, 'img' => 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Suede Desert Boots Sand', 'brand' => 'Peak Performance', 'cat' => $shoes, 'badge' => $hot, 'price' => 125.00, 'img' => 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Slip-on Breathable Trainers Grey', 'brand' => 'Velocity', 'cat' => $shoes, 'badge' => $sale, 'price' => 70.00, 'img' => 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Retro Basketball Highs Red', 'brand' => 'Aero', 'cat' => $shoes, 'badge' => $featured, 'price' => 110.00, 'img' => 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Waterproof Trail Runners Blue', 'brand' => 'Velocity', 'cat' => $shoes, 'badge' => $new, 'price' => 140.00, 'img' => 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Formal Oxford Shoes Black', 'brand' => 'LuxWalk', 'cat' => $shoes, 'badge' => $hot, 'price' => 175.00, 'img' => 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=800'],

            // WATCHES (id: 63)
            ['name' => 'Silver Chrono Master Jewel', 'brand' => 'Titan', 'cat' => $watches, 'badge' => $new, 'price' => 450.00, 'img' => 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Midnight Black Ceramic Pro', 'brand' => 'Onyx', 'cat' => $watches, 'badge' => $featured, 'price' => 620.00, 'img' => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Explorer Leather Automatic Tan', 'brand' => 'Titan', 'cat' => $watches, 'badge' => $sale, 'price' => 380.00, 'img' => 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Diver Pro Sapphire Blue', 'brand' => 'Onyx', 'cat' => $watches, 'badge' => $hot, 'price' => 850.00, 'img' => 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Minimalist Gold Edition Lux', 'brand' => 'Titan', 'cat' => $watches, 'badge' => $new, 'price' => 320.00, 'img' => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Smart Chrono Elite Black', 'brand' => 'Onyx', 'cat' => $watches, 'badge' => $featured, 'price' => 280.00, 'img' => 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Vintage Rose Gold Classic', 'brand' => 'Titan', 'cat' => $watches, 'badge' => $sale, 'price' => 410.00, 'img' => 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Rugged Field Watch Stealth', 'brand' => 'Onyx', 'cat' => $watches, 'badge' => $hot, 'price' => 240.00, 'img' => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Skeleton Mechanical Jewel Gold', 'brand' => 'Titan', 'cat' => $watches, 'badge' => $new, 'price' => 1200.00, 'img' => 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800'],
            ['name' => 'Luxury Aviator Black Pro', 'brand' => 'Onyx', 'cat' => $watches, 'badge' => $featured, 'price' => 540.00, 'img' => 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800'],
        ];

        foreach ($productPool as $data) {
            $product = Product::create([
                'store_id' => $storeId,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']) . '-' . Str::random(4),
                'brand' => $data['brand'],
                'category_niche_id' => $data['cat'],
                'badge_id' => $data['badge'],
                'description' => 'Experience premium quality and style.',
                'status' => 'published',
                'ready_to_publish' => true,
                'is_visible' => true,
            ]);

            ProductVariant::create([
                'product_id' => $product->id,
                'price' => $data['price'],
                'compare_price' => $data['price'] * 1.25,
                'sku' => strtoupper(Str::random(10)),
                'stock' => 100,
                'is_default' => true,
                'is_single' => true,
            ]);

            Media::create([
                'url' => "https://picsum.photos/seed/{$product->id}/800/1200",
                'collection' => 'thumbnail',
                'media_type' => 'image',
                'mediaable_type' => 'App\Models\Product',
                'mediaable_id' => $product->id,
                'is_temporary' => 0,
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }
}
