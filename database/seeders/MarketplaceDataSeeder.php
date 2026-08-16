<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Tag;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarketplaceDataSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        // 1. Ensure we have a few categories
        $categories = [
            ['name' => 'Laptops', 'slug' => 'laptops', 'store_id' => $storeId],
            ['name' => 'Smartphones', 'slug' => 'smartphones', 'store_id' => $storeId],
            ['name' => 'Accessories', 'slug' => 'accessories', 'store_id' => $storeId],
            ['name' => 'Audio', 'slug' => 'audio', 'store_id' => $storeId],
            ['name' => 'Wearables', 'slug' => 'wearables', 'store_id' => $storeId],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $allCats = Category::all();

        // 2. Ensure we have some badges
        $badges = [
            ['name' => 'New', 'color' => '#10b981', 'icon' => 'Sparkles'],
            ['name' => 'Hot', 'color' => '#ef4444', 'icon' => 'Flame'],
            ['name' => 'Sale', 'color' => '#f59e0b', 'icon' => 'Tag'],
            ['name' => 'Verified', 'color' => '#3b82f6', 'icon' => 'CheckCircle'],
        ];

        foreach ($badges as $badge) {
            Badge::updateOrCreate(['name' => $badge['name']], $badge);
        }

        $allBadges = Badge::all();

        // 3. Create Tags
        $tags = ['Tech', 'Apple', 'Gaming', 'Office', 'Portable'];
        foreach ($tags as $tagName) {
            Tag::updateOrCreate(['name' => $tagName], ['slug' => Str::slug($tagName), 'store_id' => $storeId]);
        }
        $allTags = Tag::all();

        // 4. Create Users for Orders
        $user = User::where('store_id', $storeId)->first() ?? User::factory()->create(['store_id' => $storeId]);

        // 5. Create Products
        $productsData = [
            [
                'name' => 'MacBook Pro 14 M3',
                'brand' => 'Apple',
                'description' => 'The most advanced laptop for professionals.',
                'image' => 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
                'price' => 1999.00,
            ],
            [
                'name' => 'iPhone 15 Pro',
                'brand' => 'Apple',
                'description' => 'Titanium design, A17 Pro chip.',
                'image' => 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 999.00,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'brand' => 'Sony',
                'description' => 'Industry-leading noise cancellation.',
                'image' => 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 349.00,
            ],
            [
                'name' => 'Logitech MX Master 3S',
                'brand' => 'Logitech',
                'description' => 'Ultimate productivity mouse.',
                'image' => 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 99.00,
            ],
            [
                'name' => 'Dell XPS 15',
                'brand' => 'Dell',
                'description' => 'Power meets beauty.',
                'image' => 'https://images.pexels.com/photos/1266982/pexels-photo-1266982.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 1799.00,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'brand' => 'Samsung',
                'description' => 'The ultimate Android experience.',
                'image' => 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 1299.00,
            ],
            [
                'name' => 'AirPods Pro 2',
                'brand' => 'Apple',
                'description' => 'Magic remastered.',
                'image' => 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 249.00,
            ],
            [
                'name' => 'Keychron K2 V2',
                'brand' => 'Keychron',
                'description' => 'Best mechanical keyboard for Mac.',
                'image' => 'https://images.pexels.com/photos/430546/pexels-photo-430546.jpeg?auto=compress&cs=tinysrgb&w=800',
                'price' => 89.00,
            ],
        ];

        foreach ($productsData as $data) {
            $slug = Str::slug($data['name']);
            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'store_id' => $storeId,
                    'name' => $data['name'],
                    'brand' => $data['brand'],
                    'description' => $data['description'],
                    'status' => 'published',
                    'is_visible' => true,
                    'ready_to_publish' => true,
                    'quality_score' => rand(70, 95),
                    'rating_average' => rand(40, 50) / 10,
                    'rating_count' => rand(5, 100),
                    'category_niche_id' => $allCats->random()->id,
                    'badge_id' => $allBadges->random()->id,
                    'releaseDate' => '2024',
                    'madeCountry' => 'US',
                ]
            );

            // Add thumbnail if not exists
            if (!$product->thumbnail) {
                $product->thumbnail()->create([
                    'url' => $data['image'],
                    'media_type' => 'image',
                    'collection' => 'thumbnail'
                ]);
            }

            // Add Gallery if empty
            if ($product->covers()->count() === 0) {
                $product->covers()->createMany([
                    ['url' => 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800', 'media_type' => 'image', 'collection' => 'gallery'],
                    ['url' => 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', 'media_type' => 'image', 'collection' => 'gallery'],
                ]);
            }

            // Create Default Variant if not exists
            $variant = $product->variants()->where('is_default', true)->first();
            if (!$variant) {
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'sku' => strtoupper(Str::random(10)),
                    'price' => $data['price'],
                    'compare_price' => $data['price'] * 1.2,
                    'stock' => rand(10, 50),
                    'is_default' => true,
                    'is_single' => true,
                    'attrs' => [],
                ]);
            }

            // Sync tags
            $product->tags()->sync($allTags->random(2)->pluck('id'));

            // Create some orders for this product to show "Sold X" if count is low
            if ($product->orders_count < 5) {
                for ($i = 0; $i < rand(1, 3); $i++) {
                    $order = Order::factory()->create([
                        'store_id' => $storeId,
                        'user_id' => $user->id,
                        'order_status' => 'delivered'
                    ]);
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_variant_id' => $variant->id,
                        'quantity' => rand(1, 2),
                        'price_snapshot' => $variant->price,
                        'subtotal' => $variant->price,
                        'product_name' => $product->name,
                    ]);
                }
            }
        }
    }
}
