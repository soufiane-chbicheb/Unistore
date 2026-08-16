<?php

namespace App\Http\Controllers;

use App\Events\OrderConfirmed;
use App\Services\Payment\StripePaymentGateway;
use App\Models\Order;
use App\Services\StockService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    public function __construct(private StripePaymentGateway $gateway) {}

    public function handle(Request $request)
    {
      // Step 1 — verify signature
       try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Step 2 — handle event
        try {
            match ($event->type) {
                'payment_intent.succeeded'      => $this->onPaymentSucceeded($event),
                'payment_intent.payment_failed' => $this->onPaymentFailed($event),
                'charge.refund.updated'         => $this->onRefundUpdated($event),
                default                         => null
            };
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('DB error in webhook', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'DB unavailable'], 503); // Stripe retries
        } catch (\Exception $e) {
            Log::error('Webhook handler failed', ['error' => $e->getMessage()]);
        }

        return response()->json(['received' => true], 200);
    }

    // payment failed
    private function onPaymentFailed($event): void
    {
            $intent = $event->data->object;
            $orderId = $intent->metadata->order_id;
            $order = Order::find($orderId);
            if (!$order) return;
            $order->update(['payment_status' => 'failed']);
            // event(new OrderFailed($order)) ; // failed payment later
    }

    // refund status updated
    private function onRefundUpdated($event): void
    {
        $refund = $event->data->object;
        // update your payment record status

    }


    private function onPaymentSucceeded($event): void
    {
        $intent = $event->data->object;
        $order  = Order::find($intent->metadata->order_id);
        if (!$order) return;
        if ($order->payment_status === 'paid') return;
        $order->update([
            'payment_status' => 'paid',
            'payment_id'     => $intent->id,
            'paid_at'        => now(),
            'order_status'   => 'confirmed',
        ]);
        // update stock
        event(new OrderConfirmed($order)) ;
        logger()->info('Order Confirmed',  [
            'order_id' => $order->id,
        ]);
    }
}