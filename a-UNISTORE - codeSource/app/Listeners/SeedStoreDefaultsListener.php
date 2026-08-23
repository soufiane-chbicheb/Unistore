<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\Events\NewStoreCreation;
use App\Jobs\SeedStoreDefaultsJob;

class SeedStoreDefaultsListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewStoreCreation $event): void
    {
        SeedStoreDefaultsJob::dispatch($event->store);
    }
}
