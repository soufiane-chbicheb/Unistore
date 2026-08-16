<?php

namespace App\Listeners;

use App\jobs\WelcomeNewAuthUsers;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserRegister implements ShouldQueue
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
        WelcomeNewAuthUsers::dispatch($event->user) ;
    }
}
