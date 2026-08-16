<?php

namespace App\Repositories;

use App\Models\Coupon;
use Illuminate\Support\Collection;

class CouponRepository
{
    public function getAll(): Collection
    {
        return Coupon::latest()->get();
    }

    public function findById(int $id): ?Coupon
    {
        return Coupon::find($id);
    }

    public function create(array $data): Coupon
    {
        return Coupon::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $coupon = $this->findById($id);
        if (!$coupon) {
            return false;
        }
        return $coupon->update($data);
    }

    public function delete(int $id): bool
    {
        $coupon = $this->findById($id);
        if (!$coupon) {
            return false;
        }
        return $coupon->delete();
    }
}
