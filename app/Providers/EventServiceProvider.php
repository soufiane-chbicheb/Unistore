<?php

namespace App\Providers;

use App\Events\OrderConfirmed;
use App\Events\UserLogin;
use App\Events\NewStoreCreation;

use App\Events\UserInvited;
use App\Listeners\SendInvitationEmail;
use App\Listeners\SeedStoreDefaultsListener;
use App\Listeners\DecrementStock;
use App\Listeners\HandleUserRegister;
use App\Listeners\HandleUserWelcomming;
use App\Listeners\NotifyAdmins;
use App\Listeners\SendInvoice;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{

    protected $listen = [
            NewStoreCreation::class => [
                  SeedStoreDefaultsListener::class
            ],
            OrderConfirmed::class => [
                DecrementStock::class ,
                NotifyAdmins::class ,
                SendInvoice::class
            ] ,
            UserLogin::class => [
                HandleUserWelcomming::class

            ] ,
            Registered::class => [
                HandleUserRegister::class
            ],
            UserInvited::class => [
                SendInvitationEmail::class
            ]
            ];
    

}
