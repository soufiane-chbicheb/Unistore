<?php

namespace App\Services;

use App\Repositories\StoreSettingRepository;

class StoreSettingService
{
    public function __construct(private StoreSettingRepository $repository)
    {
    }

    public function getStoreCurrency(): string
    {
        $setting = $this->repository->getByKey('currency');
        return $setting ? $setting->value['symbol'] ?? 'MAD' : 'MAD';
    }
}
