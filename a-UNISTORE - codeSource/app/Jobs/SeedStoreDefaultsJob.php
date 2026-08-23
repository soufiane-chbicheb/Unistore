<?php

namespace App\Jobs;

use App\Models\Store;
use Database\Seeders\NewStoreDefaultsSeeder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SeedStoreDefaultsJob implements ShouldQueue
{
    use Queueable;

    public $store;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store)
    {
        $this->store = $store;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        app(NewStoreDefaultsSeeder::class)->run($this->store->id);
    }
}
