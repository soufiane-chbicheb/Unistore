<?php

namespace App\Listeners;

use App\Events\UserInvited;
use App\Mail\RoleInvitationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendInvitationEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(UserInvited $event): void
    {
        Mail::to($event->invitation->email)->send(new RoleInvitationMail($event->invitation));
    }
}
