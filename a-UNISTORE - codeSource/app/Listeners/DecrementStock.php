<?php

namespace App\Listeners;

use App\Events\OrderConfirmed;
use App\Services\StockService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class DecrementStock
{
    /**
     * Create the event listener.
     */
    use InteractsWithQueue ;

    public function __construct(public StockService $stockService)
    {
        //
    }

    /**
     * Handle the event.php artisan queue:failed-table
     */
    public function handle(OrderConfirmed $event): void
    {
        $this->stockService->decrementFromOrder($event->order);
    }
}
