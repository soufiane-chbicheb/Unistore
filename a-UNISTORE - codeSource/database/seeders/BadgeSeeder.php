<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            ['name' => 'None',     'color' => 'transparent', 'icon' => 'Ban'],
            ['name' => 'New',      'color' => '#22c55e',     'icon' => 'Sparkles'],
            ['name' => 'Hot',      'color' => '#f97316',     'icon' => 'Flame'],
            ['name' => 'Sale',     'color' => '#ef4444',     'icon' => 'Tag'],
            ['name' => 'Limited',  'color' => '#a855f7',     'icon' => 'Zap'],
            ['name' => 'Featured', 'color' => '#3b82f6',     'icon' => 'Rocket'],
            ['name' => 'test', 'color' => '#405a14ff',     'icon' => 'Plus'],
        ];

        foreach ($badges as $badge) {
            Badge::updateOrCreate(['name' => $badge['name']], $badge);
        }
    }
}