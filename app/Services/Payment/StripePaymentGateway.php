<?php

namespace App\Services\Payment;

use App\DTOs\Order\CreateOrderDTO;
use App\Exceptions\PaymentException;
use App\Models\Order;
use App\Services\Payment\PaymentGateway;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Refund;
use Stripe\Stripe;

class StripePaymentGateway extends PaymentGateway
{

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }
  

    public function createPayment(Order $order) : array
    {
        // Create a PaymentIntent - this HOLDS the money but doesn't charge yet
        $currency = 'MAD';
        $paymentIntent = PaymentIntent::create([
            'amount' => $order->total_amount * 100, // Stripe uses cents, so $50.00 = 5000
            'currency' => $currency,
            'metadata' => ['order_id' => $order->id],
             'automatic_payment_methods' => [
                'enabled'         => true,
                'allow_redirects' => 'never', // ← fixes the error
            ],
        ]);
        
         if (!$paymentIntent->id) {
            throw new PaymentException('Failed to create payment intent');
        }
        
        return [
            'payment_id'    => $paymentIntent->id,
            'client_secret' => $paymentIntent->client_secret,
        ];
    }


    public function cancelPayment(string $paymentIntent): void 
    {
        $intend = PaymentIntent::retrieve($paymentIntent);
        if (!$intend) {
            throw new PaymentException('No Payment Intent to cancel');
        }

        $intend->cancel();
    }

    public function capturePayment(string $paymentId): void
    {
        
        // Capture the authorized payment - NOW the money actually moves
        $intent = PaymentIntent::retrieve($paymentId);

        // Check if authorization succeeded
        if ($intent->status !== 'requires_capture') {
            throw new PaymentException('Payment authorization failed: ' . $intent->status);
        }
        
        $intent->capture();
    }

    public function refund(string $paymentId, ?int $amount = null): void
    {
        // retrieve amount from Stripe directly — no need to store it yourself
        $intent = PaymentIntent::retrieve($paymentId);

        $refund = Refund::create([
            'payment_intent' => $paymentId,
            'amount'         => $amount ?? $intent->amount, // full refund if no amount passed
        ]);

        if ($refund->status === 'failed') {
        throw new PaymentException("Refund failed: {$refund->failure_reason}");
    }
    }

}
