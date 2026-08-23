<?php

namespace App\Services\Payment;

use App\Models\Order;
use Stripe\PaymentIntent;

abstract class PaymentGateway
{
    abstract public function createPayment(Order $order): array;
    abstract public function capturePayment(string $paymentId): void;
    abstract public function cancelPayment(string $paymentId): void;
    abstract public function refund(string $paymentId): void ;
}