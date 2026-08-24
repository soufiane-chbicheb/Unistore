<?php

namespace App\Repositories;

use App\Models\Promotion;
use Illuminate\Support\Collection;

class PromotionRepository
{
    public function getAll(): Collection
    {
        return Promotion::latest()->get();
    }

    public function findById(int $id): ?Promotion
    {
        return Promotion::find($id);
    }

    public function create(array $data): Promotion
    {
        return Promotion::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $promotion = $this->findById($id);
        if (!$promotion) {
            return false;
        }
        return $promotion->update($data);
    }

    public function delete(int $id): bool
    {
        $promotion = $this->findById($id);
        if (!$promotion) {
            return false;
        }
        return $promotion->delete();
    }


    public function getPromotionsSetForAmount() : Collection {
        return   Promotion::where('is_active', true)->get();
    }


}
