<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingSettingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id'                       => Store::inRandomOrder()->first()?->id ?? 1,
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => 500,
            'free_shipping_threshold_items'  => null,
            'base_weight_kg'                 => null,
            'extra_kg_price'                 => null,
            'shipping_class'                 => [
                                            ['value' => 'express' , 'label' => 'Livraison Express (24-48h)'] ,
                                            ['value' => 'standard' , 'label' => 'Livraison Standard (3-5 jours)'] ,
                                            ['value' => 'pickup' , 'label' => 'Retrait en Magasin'] ,
                                            ['value' => 'relay' , 'label' => 'Point Relais'] ,
            ] ,
        ];
    }
    

    // ── Free shipping types ────────────────────────────────────────────────

    public function freeByAmount(float $amount = 500): static
    {
        return $this->state(fn () => [
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => $amount,
            'free_shipping_threshold_items'  => null,
        ]);
    }

    public function freeByItems(int $items = 5): static
    {
        return $this->state(fn () => [
            'free_shipping_type'             => 'items',
            'free_shipping_threshold_amount' => null,
            'free_shipping_threshold_items'  => $items,
        ]);
    }

    public function freeByEither(float $amount = 500, int $items = 5): static
    {
        return $this->state(fn () => [
            'free_shipping_type'             => 'either',
            'free_shipping_threshold_amount' => $amount,
            'free_shipping_threshold_items'  => $items,
        ]);
    }

    public function freeByBoth(float $amount = 500, int $items = 5): static
    {
        return $this->state(fn () => [
            'free_shipping_type'             => 'both',
            'free_shipping_threshold_amount' => $amount,
            'free_shipping_threshold_items'  => $items,
        ]);
    }

    // ── Weight pricing ─────────────────────────────────────────────────────

    public function withWeightPricing(float $baseKg = 2, float $pricePerKg = 5): static
    {
        return $this->state(fn () => [
            'base_weight_kg' => $baseKg,
            'extra_kg_price' => $pricePerKg,
        ]);
    }

    public function withoutWeightPricing(): static
    {
        return $this->state(fn () => [
            'base_weight_kg' => null,
            'extra_kg_price' => null,
        ]);
    }

    // ── No free shipping ───────────────────────────────────────────────────

    public function noFreeShipping(): static
    {
        return $this->state(fn () => [
            'free_shipping_type'             => 'amount',
            'free_shipping_threshold_amount' => null,
            'free_shipping_threshold_items'  => null,
        ]);
    }
}