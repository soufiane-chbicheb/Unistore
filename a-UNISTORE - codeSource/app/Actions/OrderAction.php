<?php

namespace App\Actions;

use App\Context\Order\CheckoutContext;
use App\Context\Order\SinglerOrderContext;
use App\DTOs\CreateOrderDTO;
use App\Services\Factories\PaymentGatewayFactory;
use App\Services\OrderService;
use App\Services\Payment\StripePaymentGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderAction
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private OrderService $orderService ,
        private PaymentGatewayFactory $gatewayFactory
    )
    {
    }

    public function execute(CheckoutContext $context )
    {
        $dto = $context->dto;
        $result = [] ;
        if($dto->payment_method == 'COD'){
           $order =  $this->orderService->placeOrder($context);
           $result = [
               'order_id' => $order?->id,
               'tracking_token' => $order?->tracking_token
           ];
        }else{
           $gateway  = $this->gatewayFactory->make($context->dto->payment_method);
           $result =   $this->orderService->placeOrderWithPayment($context  , $gateway);
        }
        return $result ;
    }

    

  
}
