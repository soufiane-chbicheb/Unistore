<?php
namespace App\Observers;

use App\Models\Order;
use App\Services\Google\GoogleSheetsService;

class OrderObserver
{
    public function __construct(
        protected GoogleSheetsService $sheetService
    ) {}

    public function created(Order $order)
    {
        if(!$this->sheetService->getSpreadsheetsId()) {
            return ;
        }
        $this->sheetService->appendOrder($order);
    }

    public function updated(Order $order)
    {
        if(!$this->sheetService->getSpreadsheetsId()) {
            return ;
        }
        $this->sheetService->updateOrder($order);
    }

    public function deleted(Order $order)
    {
        if(!$this->sheetService->getSpreadsheetsId()) {
            return ;
        }
        $this->sheetService->deleteOrder($order);
    }
}
