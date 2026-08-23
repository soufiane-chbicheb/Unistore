<?php

namespace App\Services;

use App\Models\HomeLayoutOrc;
use App\Models\Product;
use App\Models\Banner;
use App\Models\RuleBasedCollection;

class HomeFeedService
{
    /**
     * Get the standardized feed (array of feed items) for both Storefront and Home Editor.
     *
     * @param bool $allIncludeInactive If true, returns all sections regardless of is_active (useful for editor).
     * @return array
     */
    public function getFeed($allIncludeInactive = false)
    {
        $orcs = HomeLayoutOrc::with(['sortable' => function($morph) {
            $morph->morphWith([
                Banner::class => ['slots', 'slots.mainMedia', 'slots.secondaryMedia'],
            ]);
        }])
        ->orderBy('order')
        ->get();

        $feed = [];

        foreach ($orcs as $orc) {
            $component = $orc->sortable;
            
            if (!$component) {
                continue;
            }

            if (!$allIncludeInactive && !$component->is_active) {
                continue;
            }

            if ($component instanceof Banner) {
                $feed[] = [
                    'type' => 'banner',
                    'data' => $component,
                    'orc_id' => $orc->id,
                    'order' => $orc->order
                ];
            } elseif ($component instanceof RuleBasedCollection) {
                $query = Product::with(['thumbnail', 'badge', 'nichCategory']);
                
                $rules = $component->rules ?? [];
                foreach ($rules as $rule) {
                    $field = $rule['field'] ?? null;
                    $operator = $rule['operator'] ?? '=';
                    $value = $rule['value'] ?? null;
                    
                    if ($field && $value !== null) {
                        if ($field === 'category_id') {
                            $query->where('category_niche_id', $operator, $value);
                        } elseif ($field === 'category') {
                            $query->whereHas('nichCategory', function ($q) use ($value) {
                                $q->withoutGlobalScopes(); // Categories might be global
                                if (is_numeric($value)) {
                                    $q->where('id', $value);
                                } else {
                                    $q->where('name', $value)->orWhere('slug', $value);
                                }
                            });
                        } elseif ($field === 'badge_id') {
                            $query->where('badge_id', $operator, $value);
                        } elseif ($field === 'badge') {
                            $query->whereHas('badge', function ($q) use ($value) {
                                $q->withoutGlobalScopes(); // Badges are global
                                if (is_numeric($value)) {
                                    $q->where('id', $value);
                                } else {
                                    $q->where('name', $value);
                                }
                            });
                        } elseif ($field === 'discount') {
                            $query->whereHas('variants', function ($q) use ($value) {
                                $q->whereRaw("((compare_price - price) / compare_price * 100) >= ?", [$value]);
                            });
                        } else {
                            $query->where($field, $operator, $value);
                        }
                    }
                }
                
                $limit = $component->layout_config['displayLimit'] ?? 10;
                $products = $query->with(['variants' => function($q) {
                    $q->where('is_default', true);
                }])->limit($limit)->get()->map(function($p) {
                   $defaultVariant = $p->variants->first();
                   return [
                      'id' => $p->id,
                      'name' => $p->name,
                      'brand' => $p->brand,
                      'price' => $defaultVariant ? $defaultVariant->price : 0,
                      'originalPrice' => $defaultVariant ? $defaultVariant->compare_price : 0,
                      'image' => $p->thumbnail ? $p->thumbnail->url ?? null : null,
                      'category' => $p->nichCategory ? $p->nichCategory->name : null,
                      'rating' => $p->rating_average ?? 5,
                      'reviews' => $p->rating_count ?? 0,
                      'badge' => $p->badge ? $p->badge->name : null,
                   ];
                });
                
                $componentData = $component->toArray();
                $componentData['products'] = $products;
                
                $feed[] = [
                    'type' => 'collection',
                    'data' => $componentData,
                    'orc_id' => $orc->id,
                    'order' => $orc->order
                ];
            }
        }

        return $feed;
    }
}
