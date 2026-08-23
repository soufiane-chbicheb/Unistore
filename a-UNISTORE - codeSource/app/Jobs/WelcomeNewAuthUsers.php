<?php

namespace App\jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

class WelcomeNewAuthUsers implements ShouldQueue
{
     use InteractsWithQueue , Queueable , Dispatchable;


    /**
     * Create a new job instance.
     */
    public function __construct(private User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
      logger("hello user welcome " ) ;
    }
}
