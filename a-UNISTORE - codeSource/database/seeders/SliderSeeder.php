<?php

namespace Database\Seeders;

use App\Models\Slider;
use App\Models\Slide;
use App\Models\Store;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    public function run(): void
    {
        $storeId = Store::first()->id;

        $slider = Slider::create([
            'store_id' => $storeId,
            'name' => 'Home Hero Slider',
            'is_active' => true,
            'autoplay_speed' => 5000,
            'show_arrows' => true,
            'show_dots' => true,
        ]);

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
            $slider->slides()->create($slideData);
        }
    }
}
