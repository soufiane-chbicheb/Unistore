<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\BannerSlot;
use App\Models\Media;
use App\Models\Store;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        BannerSlot::query()->delete();
        Banner::query()->delete();
        Media::where('collection', 'banner')->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $data = [
            [
                "banner" => [
                    'name'          => 'Spring Luxury 2026',
                    'key'           => 'spring_2026',
                    'slug'          => 'spring-2026',
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '21:9',
                    'border_radius' => '12px',
                    'bg_color'      => '#f3f4f6',
                ],
                "slots" => [
                    [
                        'slot_key'   => 'left',
                        'width'      => "65",
                        'is_visible' => true,
                        'bg_color'   => '#ffffff',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'EDITORIAL', 'color' => '#6b7280', 'visible' => true],
                            'title'     => ['text' => 'The Spring Luxe Edit', 'color' => '#111827', 'visible' => true],
                            'paragraph' => ['text' => 'Experience the intersection of comfort and sophistication with our latest seasonal release.', 'color' => '#4b5563', 'visible' => true],
                            'button'    => ['text' => 'SHOP THE COLLECTION', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                        ],
                    ],
                    [
                        'slot_key'          => 'right',
                        'width'             => "35",
                        'is_visible'        => true,
                        'image'             => 'https://images.pexels.com/photos/1039439/pexels-photo-1039439.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'Urban Essence Drop',
                    'key'           => 'urban_drop',
                    'slug'          => 'urban-essence',
                    'direction'     => 'rtl',
                    'is_active'     => true,
                    'aspect_ratio'  => '21:9',
                    'border_radius' => '12px',
                    'bg_color'      => '#111827',
                ],
                "slots" => [
                    [
                        'slot_key'          => 'left',
                        'width'             => "35",
                        'is_visible'        => true,
                        'image'             => 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    ],
                    [
                        'slot_key'   => 'middle',
                        'width'      => '65',
                        'is_visible' => true,
                        'bg_color'   => '#111827',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'STREETWEAR', 'color' => '#fbbf24', 'visible' => true],
                            'title'     => ['text' => 'Urban Essence', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Bold designs for the modern urban explorer. Limited quantity available.', 'color' => '#9ca3af', 'visible' => true],
                            'button'    => ['text' => 'DISCOVER MORE', 'bg_color' => '#fbbf24', 'text_color' => '#000000', 'visible' => true],
                        ],
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'Flash Sale Weekend',
                    'key'           => 'flash_weekend',
                    'slug'          => 'flash-sale-weekend',
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '32:9',
                    'border_radius' => '0px',
                    'bg_color'      => '#dc2626',
                ],
                "slots" => [
                    [
                        'slot_key'   => 'left',
                        'width'      => '100',
                        'is_visible' => true,
                        'bg_color'   => '#dc2626',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'LIMITED TIME', 'color' => '#ffffff', 'visible' => true],
                            'title'     => ['text' => 'Weekend Flash: Up to 50% Off', 'color' => '#ffffff', 'visible' => true],
                            'paragraph' => ['text' => 'Our biggest sale of the season is here. Selected items only.', 'color' => '#fee2e2', 'visible' => true],
                            'button'    => ['text' => 'SHOP THE SALE', 'bg_color' => '#ffffff', 'text_color' => '#dc2626', 'visible' => true],
                        ],
                    ],
                ],
            ],
            [
                "banner" => [
                    'name'          => 'The Accessories Edit',
                    'key'           => 'accessories_edit',
                    'slug'          => 'the-accessories-edit',
                    'direction'     => 'ltr',
                    'is_active'     => true,
                    'aspect_ratio'  => '16:9',
                    'border_radius' => '24px',
                    'bg_color'      => '#ffffff',
                ],
                "slots" => [
                    [
                        'slot_key'          => 'left',
                        'width'             => "50",
                        'is_visible'        => true,
                        'image'             => 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    ],
                    [
                        'slot_key'   => 'right',
                        'width'      => "50",
                        'is_visible' => true,
                        'bg_color'   => '#f9fafb',
                        'elements'   => [
                            'eyebrow'   => ['text' => 'CURATED', 'color' => '#6b7280', 'visible' => true],
                            'title'     => ['text' => 'Premium Details', 'color' => '#111827', 'visible' => true],
                            'paragraph' => ['text' => 'Complete your look with our hand-picked selection of luxury watches and fine jewelry.', 'color' => '#4b5563', 'visible' => true],
                            'button'    => ['text' => 'EXPLORE ACCESSORIES', 'bg_color' => '#111827', 'text_color' => '#ffffff', 'visible' => true],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($data as $item) {
            $bannerData = $item['banner'];
            $bannerData['store_id'] = $storeId;
            $banner = Banner::create($bannerData);
            foreach ($item['slots'] as $slotData) {
                if (isset($slotData['image'])) {
                    $media = Media::create([
                        'url' => "https://picsum.photos/seed/banner-" . rand(1, 1000) . "/1920/1080",
                        'media_type' => 'image',
                        'mediaable_type' => 'App\Models\Banner',
                        'collection' => 'banner',
                    ]);
                    $slotData['main_media_id'] = $media->id;
                    unset($slotData['image']);
                }
                $banner->slots()->create($slotData);
            }
        }
    }
}