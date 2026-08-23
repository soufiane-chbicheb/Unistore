<?php

namespace App\Listeners;

use App\Jobs\WelcomBackUser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserWelcomming
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
    public function handle(object $event): void
    {
        WelcomBackUser::dispatch($event->user);
    }
}
