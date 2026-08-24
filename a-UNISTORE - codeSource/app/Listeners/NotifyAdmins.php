<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Mail\OrderConfirmedMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class NotifyAdmins implements ShouldQueue
{
    use InteractsWithQueue, Queueable;
    public function handle(OrderConfirmed $event): void
    {
        $admins = $this->getRecipients($event->order->store_id);
        
        foreach ($admins as $adminEmail) {
            Mail::to($adminEmail)
                ->send(new OrderConfirmedMail($event->order));
        }
    }

    public function getRecipients($storeId) : array {
         $admins  = User::withoutGlobalScope('store')
            ->where('store_id', $storeId)
            ->whereHas("roles" , function($q){
               $q->whereIn("name" , ["super_admin" , "admin", "manager"]);
            })->pluck('email');

         if($admins->isNotEmpty() ){
            return $admins->toArray();
         }
         return [] ;
                    
    }
}
