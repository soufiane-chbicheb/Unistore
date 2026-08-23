<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Mail\JobFailedMail;
use App\Mail\OrderConfirmedMail;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendInvoice implements ShouldQueue
{ 
    /**
     * Create the event listener.
     */
    use InteractsWithQueue ;
    private Order $order ;

    /**
     * Handle the event.
     */
    public function handle(OrderConfirmed $event): void
    {
        $this->order = $event->order;
        $email = $this->order->address->email ;
        if(!$email) return ;
        Mail::to($email)
               ->queue(new OrderConfirmedMail($this->order))
        ;
        // sms confirmation later
    }

    public function failed(\Throwable $exception) : void {
        Mail::to(config('mail.from'))
               ->queue(new JobFailedMail($this->order , $exception))
        ;
    }

}
