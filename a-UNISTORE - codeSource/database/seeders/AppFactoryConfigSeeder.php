<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppFactoryConfig;

class AppFactoryConfigSeeder extends Seeder
{
    /**
     * Seed the application's developer-defined factory configurations.
     */
    public function run(): void
    {
        AppFactoryConfig::truncate();

        $collections_factoryPayloads = [
            [
                'config_key' => 'collections.home.new_arrivals',
                'description' => 'Factory default for the New Season Arrivals rule-based collection',
                'payload' => [
                    'key' => 'home.new_arrivals',
                    'name' => 'New Season Arrivals',
                    'slug' => 'new-season-arrivals',
                    'is_active' => true,
                    'layout_config' => [
                        'gap' => 24,
                        'displayLimit' => 1,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'showBadge' => true,
                        'showPrice' => true,
                        'textAlign' => 'left',
                        'aspectRatio' => '3/4',
                        'hoverEffect' => 'zoom',
                        'borderRadius' => 0
                    ],
                    'rules' => [
                        ['field' => 'badge_id', 'value' => '2', 'operator' => '=']
                    ],
                ]
            ],
            [
                'config_key' => 'collections.home.featured',
                'description' => 'Factory default for the The Featured Edit rule-based collection',
                'payload' => [
                    'key' => 'home.featured',
                    'name' => 'The Featured Edit',
                    'slug' => 'the-featured-edit',
                    'is_active' => true,
                    'layout_config' => [
                        'gap' => 24,
                        'displayLimit' => 12,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'showBadge' => true,
                        'showPrice' => true,
                        'textAlign' => 'left',
                        'aspectRatio' => '3/4',
                        'hoverEffect' => 'zoom',
                        'borderRadius' => 0
                    ],
                    'rules' => [
                        ['field' => 'badge_id', 'value' => '6', 'operator' => '=']
                    ],
                ]
            ],
            [
                'config_key' => 'collections.home.shoes',
                'description' => 'Factory default for the Featured Footwear rule-based collection',
                'payload' => [
                    'key' => 'home.shoes',
                    'name' => 'Featured Footwear',
                    'slug' => 'performance-footwear',
                    'is_active' => true,
                    'layout_config' => [
                        'gap' => 24,
                        'displayLimit' => 4,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'showBadge' => true,
                        'showPrice' => true,
                        'textAlign' => 'left',
                        'aspectRatio' => '3/4',
                        'hoverEffect' => 'zoom',
                        'borderRadius' => 12
                    ],
                    'rules' => [
                        ['id' => 'f2', 'field' => 'category_id', 'value' => 'Menswear', 'operator' => '=']
                    ],
                ]
            ],
            [
                'config_key' => 'collections.home.watches',
                'description' => 'Factory default for the Luxury Timepieces rule-based collection',
                'payload' => [
                    'key' => 'home.watches',
                    'name' => 'Luxury Timepieces',
                    'slug' => 'luxury-timepieces',
                    'is_active' => true,
                    'layout_config' => [
                        'gap' => 24,
                        'displayLimit' => 3,
                        'paddingInline' => 0
                    ],
                    'card_config' => [
                        'showBadge' => true,
                        'showPrice' => true,
                        'textAlign' => 'left',
                        'aspectRatio' => '1/1',
                        'hoverEffect' => 'none',
                        'borderRadius' => 22
                    ],
                    'rules' => [
                        ['field' => 'category_id', 'value' => '63', 'operator' => '=']
                    ],
                ]
            ],
        ];

        $banners_factoryPayloads = [
            [
                'config_key' => 'banners.spring_2026',
                'description' => 'Factory default for the Spring Collection 2026 hero banner',
                'payload' => [
                    'name' => 'Spring Collection 2026',
                    'key' => 'spring_2026',
                    'slug' => 'spring-2026',
                    'order' => 0,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '12px',
                    'bg_color' => '#FF5733',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '50',
                            'is_visible' => true,
                            'bg_color' => '#1a1a1a',
                            'elements' => [
                                'eyebrow'   => ['text' => 'NEW ARRIVALS', 'color' => '#ffd700', 'visible' => true],
                                'title'     => ['text' => 'Premium Gear', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Discover the durability and style of our latest 2026 release.', 'color' => '#cccccc', 'visible' => true],
                                'button'    => ['text' => 'Shop Now', 'bg_color' => '#ffffff', 'text_color' => '#000000', 'visible' => true]
                            ]
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '50',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/spring_main/1200/800',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                            'secondary_media' => [
                                'url' => 'https://picsum.photos/seed/spring_side/800/600',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.flash_weekend',
                'description' => 'Factory default for the Flash Sale Weekend banner',
                'payload' => [
                    'name' => 'Flash Sale Weekend',
                    'key' => 'flash_weekend',
                    'slug' => 'flash-sale-weekend',
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '32:9',
                    'border_radius' => '0px',
                    'bg_color' => '#dc2626',
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
                ]
            ],
            [
                'config_key' => 'banners.season_lookbook',
                'description' => 'Factory default for the New Season Lookbook banner',
                'payload' => [
                    'name' => 'New Season Lookbook',
                    'key' => 'season_lookbook',
                    'slug' => 'season-lookbook',
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '16:9',
                    'border_radius' => '24px',
                    'bg_color' => '#f9fafb',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '35',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
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
                            'main_media' => [
                                'url' => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                        ],
                    ],
                ]
            ],
            [
                'config_key' => 'banners.urban_2026',
                'description' => 'Factory default for the Urban Vibes Drop promotional banner',
                'payload' => [
                    'name' => 'Urban Vibes Drop',
                    'key' => 'urban_2026',
                    'slug' => 'urban-vibes',
                    'order' => 1,
                    'direction' => 'rtl',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '12px',
                    'bg_color' => '#000000',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '35',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/urban_main/1920/1080',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                        ],
                        [
                            'slot_key' => 'middle',
                            'width' => '65',
                            'is_visible' => true,
                            'bg_color' => '#111111',
                            'elements' => [
                                'eyebrow'   => ['text' => 'LIMITED DROP', 'color' => '#fbbf24', 'visible' => true],
                                'title'     => ['text' => 'Urban Vibes', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Street-ready essentials for the modern explorer.', 'color' => '#9ca3af', 'visible' => true],
                                'button'    => ['text' => 'VIEW DROP', 'bg_color' => '#fbbf24', 'text_color' => '#000000', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.flash_sale_2026',
                'description' => 'Factory default for the Flash Sale 2026 emergency banner',
                'payload' => [
                    'name' => 'Flash Sale 2026',
                    'key' => 'flash_sale_2026',
                    'slug' => 'flash-sale',
                    'order' => 2,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '21:9',
                    'border_radius' => '0px',
                    'bg_color' => '#dc2626',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '100',
                            'is_visible' => true,
                            'bg_color' => '#dc2626',
                            'elements' => [
                                'eyebrow'   => ['text' => 'HURRY UP!', 'color' => '#ffffff', 'visible' => true],
                                'title'     => ['text' => '60% OFF EVERYTHING', 'color' => '#ffffff', 'visible' => true],
                                'paragraph' => ['text' => 'Use code FLASH60 at checkout. Ends at midnight.', 'color' => '#fee2e2', 'visible' => true],
                                'button'    => ['text' => 'CLAIM OFFER', 'bg_color' => '#000000', 'text_color' => '#ffffff', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ],
            [
                'config_key' => 'banners.minimal_2026',
                'description' => 'Factory default for the Minimalist Showcase banner',
                'payload' => [
                    'name' => 'Minimalist Showcase',
                    'key' => 'minimal_2026',
                    'slug' => 'minimalist-showcase',
                    'order' => 3,
                    'direction' => 'ltr',
                    'is_active' => true,
                    'aspect_ratio' => '16:9',
                    'border_radius' => '20px',
                    'bg_color' => '#ffffff',
                    'slots' => [
                        [
                            'slot_key' => 'left',
                            'width' => '50',
                            'is_visible' => true,
                            'main_media' => [
                                'url' => 'https://picsum.photos/seed/min_main/1000/1000',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ],
                            'secondary_media' => [
                                'url' => 'https://picsum.photos/seed/min_side/500/500',
                                'collection' => 'banner',
                                'media_type' => 'image',
                            ]
                        ],
                        [
                            'slot_key' => 'right',
                            'width' => '50',
                            'is_visible' => true,
                            'bg_color' => '#f9fafb',
                            'elements' => [
                                'eyebrow'   => ['text' => 'COLLECTION', 'color' => '#6b7280', 'visible' => true],
                                'title'     => ['text' => 'The Minimalist', 'color' => '#111827', 'visible' => true],
                                'paragraph' => ['text' => 'Clean lines and premium materials.', 'color' => '#4b5563', 'visible' => true],
                                'button'    => ['text' => 'EXPLORE', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                            ]
                        ],
                    ]
                ]
            ]
        ];

        $configs = array_merge($collections_factoryPayloads, $banners_factoryPayloads);
        foreach ($configs as $config) {
            AppFactoryConfig::updateOrCreate(
                ['config_key' => $config['config_key']],
                [
                    'description' => $config['description'],
                    'payload'     => $config['payload'],
                    'is_active'   => true,
                ]
            );
        }
    }
}
