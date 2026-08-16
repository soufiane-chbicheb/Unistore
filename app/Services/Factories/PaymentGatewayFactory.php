<?php
namespace App\Services\Factories;
use App\Exceptions\PaymentException;
use App\Services\Payment\StripePaymentGateway;



class PaymentGatewayFactory {

      public function make(string $payment_method) {
              return  match ($payment_method) {
                 "CARD" => new StripePaymentGateway(),
                 default  => throw new PaymentException("Unsupported payment method: {$payment_method}")
              };
      }

}