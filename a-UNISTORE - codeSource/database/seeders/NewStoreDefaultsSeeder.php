<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Banner;
use App\Models\BannerSlot;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\HomeLayoutOrc;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Role;
use App\Models\RuleBasedCollection;
use App\Models\ShippingSetting;
use App\Models\ShippingZone;
use App\Models\ShippingZoneCity;
use App\Models\Slider;
use App\Models\Store;
use App\Models\StoreSetting;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NewStoreDefaultsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(?int $storeId = null): void
    {
        if (!$storeId) {
             $storeId = Store::first()?->id;
        }

        if (!$storeId) {
            return;
        }
        

        DB::transaction(function () use ($storeId) {
            // 0. Seed Store-Specific Badges
            $badgesData = [
                ['name' => 'None',     'color' => 'transparent', 'icon' => 'Ban'],
                ['name' => 'New',      'color' => '#22c55e',     'icon' => 'Sparkles'],
                ['name' => 'Hot',      'color' => '#f97316',     'icon' => 'Flame'],
                ['name' => 'Sale',     'color' => '#ef4444',     'icon' => 'Tag'],
                ['name' => 'Limited',  'color' => '#a855f7',     'icon' => 'Zap'],
                ['name' => 'Featured', 'color' => '#3b82f6',     'icon' => 'Rocket'],
            ];

            $badgeMap = [];
            foreach ($badgesData as $bData) {
                $badge = Badge::updateOrCreate(
                    ['store_id' => $storeId, 'name' => $bData['name']],
                    $bData
                );
                $badgeMap[$bData['name']] = $badge->id;
            }

            // 1. Seed Categories & Subcategories
            $categoriesData = [
                "Fashion" => ["Men", "Women", "Kids", "Accessories"],
                "Electronics" => ["Smartphones", "Laptops", "Audio"],
                "Beauty" => ["Skincare", "Makeup", "Perfumes"],
                "Home" => ["Decor", "Kitchen", "Furniture"]
            ];

            $categoryMap = [];
            foreach ($categoriesData as $catName => $subs) {
                $category = Category::updateOrCreate(
                    ['store_id' => $storeId, 'name' => $catName],
                    ['slug' => Str::slug($catName) . '-' . $storeId]
                );
                $categoryMap[$catName] = $category->id;

                foreach ($subs as $subName) {
                    Category::updateOrCreate(
                        ['store_id' => $storeId, 'name' => $subName, 'parent_id' => $category->id],
                        ['slug' => Str::slug($subName) . '-' . $storeId]
                    );
                }
            }

            // 2. Seed Tags
            $tags = ['New Arrival', 'Trending', 'Limited Edition', 'Best Seller', 'Sale'];
            foreach ($tags as $tagName) {
                Tag::updateOrCreate(
                    ['store_id' => $storeId, 'name' => $tagName],
                    ['slug' => Str::slug($tagName) . '-' . $storeId]
                );
            }

            // 3. Seed Store Settings
            $defaultSettings = [
                ['key' => 'tva_enabled', 'value' => false],
                ['key' => 'tva_rate', 'value' => 20],
                ['key' => 'admin_theme_style', 'value' => 'orangeNight'],
                ['key' => 'store_theme_style', 'value' => 'luxuryNoir'],
                ['key' => 'currency', 'value' => 'MAD'],
                ['key' => 'cod_enabled', 'value' => true],
                ['key' => 'payment_enabled', 'value' => true],
                ['key' => 'store_card_config', 'value' => [
                    'cardId' => 'card-6',
                    'showPrice' => true,
                    'showRating' => true,
                    'showBorder' => true,
                    'isRounded' => true,
                    'borderRadius' => '10px',
                ]],
            ];

            foreach ($defaultSettings as $setting) {
                StoreSetting::updateOrCreate(
                    ['store_id' => $storeId, 'key' => $setting['key']],
                    ['value' => $setting['value']]
                );
            }

            // 4. Seed Banners (Three distinct styles: 1-slot, 2-slots, 3-slots)
            $bannersToSeed = [
                'spring_2026' => [
                    'banner' => [
                        'name' => 'Spring Luxury 2026',
                        'key' => 'spring_2026',
                        'slug' => 'spring-2026-' . $storeId,
                        'direction' => 'ltr',
                        'is_active' => true,
                        'aspect_ratio' => '21:9',
                        'border_radius' => '12px',
                        'bg_color' => '#f3f4f6',
                    ],
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '65',
                            'is_visible' => true,
                            'bg_color' => '#ffffff',
                            'elements' => [
                                'eyebrow' => ['text' => 'EDITORIAL', 'color' => '#6b7280', 'visible' => true],
                                'title' => ['text' => 'The Spring Luxe Edit', 'color' => '#111827', 'visible' => true],
                                'paragraph' => ['text' => 'Experience the intersection of comfort and sophistication.', 'color' => '#4b5563', 'visible' => true],
                                'button' => ['text' => 'SHOP NOW', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                            ],
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '35',
                            'is_visible' => true,
                            'image' => 'https://images.pexels.com/photos/1039439/pexels-photo-1039439.jpeg?auto=compress&cs=tinysrgb&w=1200',
                        ],
                    ],
                ],
                'flash_weekend' => [
                    'banner' => [
                        'name' => 'Flash Sale Weekend',
                        'key' => 'flash_weekend',
                        'slug' => 'flash-sale-weekend-' . $storeId,
                        'direction' => 'ltr',
                        'is_active' => true,
                        'aspect_ratio' => '32:9',
                        'border_radius' => '0px',
                        'bg_color' => '#dc2626',
                    ],
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '100',
                            'is_visible' => true,
                            'bg_color' => '#dc2626',
                            'elements' => [
                                'eyebrow' => ['text' => 'LIMITED TIME', 'color' => '#ffffff', 'visible' => true],
                                'title' => ['text' => 'Weekend Flash: Up to 50% Off', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Our biggest sale of the season is here. Selected items only.', 'color' => '#fee2e2', 'visible' => true],
                                'button' => ['text' => 'SHOP THE SALE', 'bg_color' => '#ffffff', 'text_color' => '#dc2626', 'visible' => true],
                            ],
                        ],
                    ],
                ],
                'season_lookbook' => [
                    'banner' => [
                        'name' => 'New Season Lookbook',
                        'key' => 'season_lookbook',
                        'slug' => 'season-lookbook-' . $storeId,
                        'direction' => 'ltr',
                        'is_active' => true,
                        'aspect_ratio' => '16:9',
                        'border_radius' => '24px',
                        'bg_color' => '#f9fafb',
                    ],
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '35',
                            'is_visible' => true,
                            'image' => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
                        ],
                        [
                            'slot_key' => 'middle',
                            'width' => '35',
                            'is_visible' => true,
                            'bg_color' => '#ffffff',
                            'elements' => [
                                'eyebrow' => ['text' => 'STREETWEAR', 'color' => '#6b7280', 'visible' => true],
                                'title' => ['text' => 'Urban Essence', 'color' => '#111827', 'visible' => true],
                                'paragraph' => ['text' => 'Bold designs for explorers.', 'color' => '#4b5563', 'visible' => true],
                                'button' => ['text' => 'DISCOVER', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                            ],
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '35',
                            'is_visible' => true,
                            'image' => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
                        ],
                    ],
                ],
            ];

            $seededBanners = [];
            foreach ($bannersToSeed as $key => $data) {
                $banner = Banner::withoutGlobalScopes()->updateOrCreate(
                    ['store_id' => $storeId, 'key' => $key],
                    array_merge($data['banner'], ['store_id' => $storeId])
                );
                
                $seededBanners[$key] = $banner->id;

                foreach ($data['slots'] as $slotData) {
                    if (isset($slotData['image'])) {
                        $media = Media::updateOrCreate(
                            [
                                'url' => $slotData['image'],
                                'mediaable_type' => 'banner',
                            ],
                            [
                                'media_type' => 'image',
                                'mediaable_id' => $banner->id,
                                'collection' => 'banner',
                            ]
                        );
                        $slotData['main_media_id'] = $media->id;
                        unset($slotData['image']);
                    }
                    
                    $banner->slots()->updateOrCreate(
                        ['slot_key' => $slotData['slot_key']],
                        $slotData
                    );
                }
            }

            // 5. Seed Sliders (Copied from SliderSeeder)
            $slider = Slider::updateOrCreate(
                ['store_id' => $storeId, 'name' => 'Home Hero Slider'],
                [
                    'is_active' => true,
                    'autoplay_speed' => 5000,
                    'show_arrows' => true,
                    'show_dots' => true,
                ]
            );

            $slides = [
                [
                    'image_url' => 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1400',
                    'tag' => 'New Collection · SS 2025',
                    'title' => "The Art of\nSlow Fashion",
                    'subtitle' => 'Curated pieces that transcend seasons',
                    'cta_text' => 'Explore Collection',
                    'cta_link' => '/collections/new-arrivals',
                    'panel_label' => 'Exclusive',
                    'panel_title' => 'Jewelry Noir',
                    'panel_bg' => 'rgba(18,30,50,0.92)',
                    'order' => 1,
                ],
                [
                    'image_url' => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1400',
                    'tag' => 'Beauty Edit · Spring',
                    'title' => "Ritual\nBeauty",
                    'subtitle' => 'Skincare crafted for the discerning',
                    'cta_text' => 'Shop Beauty',
                    'cta_link' => '/collections/beauty',
                    'panel_label' => 'Beauty Edit',
                    'panel_title' => 'Ritual Beauty',
                    'panel_bg' => 'rgba(22,40,28,0.92)',
                    'order' => 2,
                ],
                [
                    'image_url' => 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1400',
                    'tag' => "Men's · New Season",
                    'title' => "Tailored\nPrecision",
                    'subtitle' => 'Refined menswear for the modern man',
                    'cta_text' => 'Shop Men',
                    'cta_link' => '/collections/mens',
                    'panel_label' => "Men's",
                    'panel_title' => 'Tailored Precision',
                    'panel_bg' => 'rgba(38,18,26,0.92)',
                    'order' => 3,
                ],
            ];

            foreach ($slides as $slideData) {
                $slider->slides()->updateOrCreate(
                    ['title' => $slideData['title']],
                    $slideData
                );
            }

            // 6. Seed Rule Based Collections (Copied from RuleBasedCollectionsSeeder)
            $collectionsData = [
                [
                    'name' => 'New Season Arrivals',
                    'slug' => 'new-season-arrivals-' . $storeId,
                    'key' => 'home.new_arrivals',
                    'is_active' => true,
                    'layout_config' => [
                        'displayLimit' => 12,
                        'gap' => 24,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'aspectRatio' => '3/4',
                        'borderRadius' => 0,
                        'showPrice' => true,
                        'showBadge' => true,
                        'textAlign' => 'left',
                        'hoverEffect' => 'zoom'
                    ],
                    'rules' => [
                        ['field' => 'badge', 'operator' => '=', 'value' => 'New']
                    ],
                ],
                [
                    'name' => 'The Featured Edit',
                    'slug' => 'the-featured-edit-' . $storeId,
                    'key' => 'home.featured',
                    'is_active' => true,
                    'layout_config' => [
                        'displayLimit' => 12,
                        'gap' => 24,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'aspectRatio' => '3/4',
                        'borderRadius' => 0,
                        'showPrice' => true,
                        'showBadge' => true,
                        'textAlign' => 'left',
                        'hoverEffect' => 'zoom'
                    ],
                    'rules' => [
                        ['field' => 'badge', 'operator' => '=', 'value' => 'Featured']
                    ],
                ],
                [
                    'name' => 'Performance Footwear',
                    'slug' => 'performance-footwear-' . $storeId,
                    'key' => 'home.shoes',
                    'is_active' => true,
                    'layout_config' => [
                        'displayLimit' => 10,
                        'gap' => 24,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'aspectRatio' => '1/1',
                        'borderRadius' => 12,
                        'showPrice' => true,
                        'showBadge' => true,
                        'textAlign' => 'center',
                        'hoverEffect' => 'zoom'
                    ],
                    'rules' => [
                        ['field' => 'category', 'operator' => '=', 'value' => 'Fashion']
                    ],
                ],
            ];

            $seededCollections = [];
            foreach ($collectionsData as $cData) {
                $collection = RuleBasedCollection::withoutGlobalScopes()->updateOrCreate(
                    ['store_id' => $storeId, 'key' => $cData['key']],
                    array_merge($cData, ['store_id' => $storeId])
                );
                $seededCollections[$cData['key']] = $collection->id;
            }

            // 6.1 Seed Home Layout Orchestrator
            $sections = [
                ['id' => $seededBanners['spring_2026'] ?? null, 'type' => 'banner', 'order' => 1],
                ['id' => $seededCollections['home.new_arrivals'] ?? null, 'type' => 'product_collection', 'order' => 2],
                ['id' => $seededBanners['flash_weekend'] ?? null, 'type' => 'banner', 'order' => 3],
                ['id' => $seededCollections['home.featured'] ?? null, 'type' => 'product_collection', 'order' => 4],
                ['id' => $seededBanners['season_lookbook'] ?? null, 'type' => 'banner', 'order' => 5],
                ['id' => $seededCollections['home.shoes'] ?? null, 'type' => 'product_collection', 'order' => 6],
            ];

            foreach ($sections as $section) {
                if ($section['id']) {
                    HomeLayoutOrc::withoutGlobalScopes()->updateOrCreate(
                        [
                            'store_id' => $storeId,
                            'sortable_id' => $section['id'],
                            'sortable_type' => $section['type']
                        ],
                        ['order' => $section['order']]
                    );
                }
            }

            // 7. Seed 18 Default Products (6 per collection)
            $productTypes = [
                [
                    'badge' => $badgeMap['New'] ?? null,
                    'cat' => 'Fashion',
                    'prefix' => 'Classic Tee',
                    'attrs' => ['size' => ['S', 'M', 'L', 'XL'], 'color' => ['Black', 'White', 'Blue'], 'style' => ['Casual', 'Slim Fit']]
                ],
                [
                    'badge' => $badgeMap['Featured'] ?? null,
                    'cat' => 'Electronics',
                    'prefix' => 'Smartphone X',
                    'attrs' => ['ram' => ['8GB', '12GB', '16GB'], 'storage' => ['128GB', '256GB', '512GB'], 'color' => ['Silver', 'Graphite']]
                ],
                [
                    'badge' => $badgeMap['Hot'] ?? null,
                    'cat' => 'Home',
                    'prefix' => 'Minimalist Chair',
                    'attrs' => ['style' => ['Modern', 'Vintage', 'Industrial'], 'color' => ['Grey', 'Brown', 'Beige']]
                ],
            ];

            $count = 1;
            foreach ($productTypes as $type) {
                for ($j = 1; $j <= 6; $j++) {
                    $productName = "{$type['prefix']} #{$j}";
                    $product = Product::updateOrCreate(
                        ['store_id' => $storeId, 'slug' => Str::slug($productName) . '-' . $storeId],
                        [
                            'name' => $productName,
                            'brand' => 'UniStore',
                            'description' => "This is a premium {$type['prefix']} product description for item #{$j}.",
                            'status' => 'published',
                            'ready_to_publish' => true,
                            'is_featured' => $type['badge'] && $type['badge'] == ($badgeMap['Featured'] ?? -1),
                            'is_visible' => true,
                            'category_niche_id' => $categoryMap[$type['cat']] ?? null,
                            'badge_id' => $type['badge'],
                        ]
                    );

                    // Generate variants based on attributes
                    $attrKeys = array_keys($type['attrs']);
                    $firstAttr = $attrKeys[0];
                    $secondAttr = $attrKeys[1] ?? null;

                    foreach ($type['attrs'][$firstAttr] as $idx => $val1) {
                        $val2 = $secondAttr ? $type['attrs'][$secondAttr][array_rand($type['attrs'][$secondAttr])] : null;
                        $attrs = [$firstAttr => $val1];
                        if ($val2) $attrs[$secondAttr] = $val2;
                        
                        // Add more attributes if available
                        if (isset($attrKeys[2])) {
                            $val3 = $type['attrs'][$attrKeys[2]][array_rand($type['attrs'][$attrKeys[2]])];
                            $attrs[$attrKeys[2]] = $val3;
                        }

                        $isDefault = ($idx === 0);
                        $price = rand(100, 1000);
                        
                        ProductVariant::updateOrCreate(
                            ['product_id' => $product->id, 'sku' => Str::upper(Str::slug($productName) . "-" . implode("-", array_values($attrs))) . "-" . $storeId],
                            [
                                'price' => $price,
                                'compare_price' => $price * 1.2,
                                'stock' => rand(10, 100),
                                'is_default' => $isDefault,
                                'is_single' => false,
                                'attrs' => $attrs,
                            ]
                        );
                    }

                    // Add thumbnail
                    Media::updateOrCreate(
                        [
                            'mediaable_id' => $product->id,
                            'mediaable_type' => 'product',
                            'collection' => 'thumbnail',
                        ],
                        [
                            'url' => "https://picsum.photos/seed/{$product->id}/800/1200",
                            'media_type' => 'image',
                        ]
                    );

                    $count++;
                }
            }

            // 8. Seed 3 Promotions
            $promotions = [
                ['name' => 'Welcome Sale', 'type' => 'percentage', 'value' => 10, 'minimum_order_amount' => 500, 'max_discount_amount' => 100],
                ['name' => 'Flash Deal', 'type' => 'percentage', 'value' => 25, 'minimum_order_amount' => 1000, 'max_discount_amount' => 400],
                ['name' => 'Free Delivery', 'type' => 'free_shipping', 'value' => 0, 'minimum_order_amount' => 300 ,'max_discount_amount' => 200],
            ];

            foreach ($promotions as $pData) {
                Promotion::updateOrCreate(
                    ['store_id' => $storeId, 'minimum_order_amount' => $pData['minimum_order_amount']],
                    array_merge($pData, [
                        'is_active' => true,
                        'valid_from' => now(),
                        'valid_until' => now()->addMonths(1),
                    ])
                );
            }

            // 9. Seed 3 Coupons
            $coupons = [
                ['code' => 'WELCOME10', 'description' => '10% Off your first order', 'type' => 'percentage', 'value' => 10],
                ['code' => 'SAVE50', 'description' => '50 MAD Off', 'type' => 'fixed', 'value' => 50],
                ['code' => 'VIPONLY', 'description' => 'Exclusive 20% Discount', 'type' => 'percentage', 'value' => 20],
            ];

            foreach ($coupons as $cData) {
                Coupon::updateOrCreate(
                    ['store_id' => $storeId, 'code' => $cData['code']],
                    array_merge($cData, [
                        'is_active' => true,
                        'valid_from' => now(),
                        'valid_until' => now()->addMonths(1),
                        'max_uses_per_user' => 1,
                    ])
                );
            }

            // 10. Seed Shipping Settings & Zones
            $shippingSettings = ShippingSetting::updateOrCreate(
                ['store_id' => $storeId],
                [
                    'free_shipping_type' => 'amount',
                    'free_shipping_threshold_amount' => 500,
                    'shipping_class' => ['standard'],
                ]
            );

            $zones = [
                ['name' => 'Major Cities', 'price' => 30, 'estimated_days' => 2, 'cities' => ['Casablanca', 'Rabat', 'Marrakech']],
                ['name' => 'Secondary Cities', 'price' => 45, 'estimated_days' => 4, 'cities' => ['Agadir', 'Fes', 'Tanger']],
                ['name' => 'Remote Areas', 'price' => 60, 'estimated_days' => 7, 'cities' => ['Oujda', 'Kenitra', 'Tetouan']],
            ];

            foreach ($zones as $zData) {
                $zone = ShippingZone::updateOrCreate(
                    ['store_id' => $storeId, 'name' => $zData['name']],
                    [
                        'price' => $zData['price'],
                        'estimated_days' => $zData['estimated_days'],
                        'is_active' => true,
                    ]
                );

                foreach ($zData['cities'] as $cityName) {
                    ShippingZoneCity::updateOrCreate(
                        ['shipping_zone_id' => $zone->id, 'city' => $cityName],
                        []
                    );
                }
            }

            // 11. Seed Default Roles (Global for now, or add store_id if needed)
            $roles = [
                [
                    'name' => 'Admin',
                    'claims' => [
                        'manage-products', 'manage-orders', 'manage-customers', 
                        'view-reports', 'manage-settings', 'manage-roles', 
                        'manage-banners', 'manage-collections'
                    ],
                ],
                [
                    'name' => 'Manager',
                    'claims' => [
                        'manage-products', 'manage-orders', 'manage-customers', 'view-reports'
                    ],
                ],
                [
                    'name' => 'Editor',
                    'claims' => [
                        'manage-banners', 'manage-collections'
                    ],
                ],
            ];

            foreach ($roles as $roleData) {
                Role::updateOrCreate(
                    ['name' => $roleData['name']],
                    $roleData
                );
            }
        });
    }
}
