// PaymentForm.jsx
import { useToast } from '@/contextHooks/useToasts';
import { router } from '@inertiajs/react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { route } from 'ziggy-js';
interface PaymentFormProps {
    orderCreatedRespose : any
}
export default function PaymentForm({orderCreatedRespose}:PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const {addToast} = useToast() ; 
    const [stripeReady, setStripeReady] = useState(false);

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        e.stopPropagation()
        // stripe and elements not loaded yet
        if (!stripe || !elements) return;

        setLoading(true);
       console.log('submitting payment...');
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // you already have orderId from Inertia onSuccess props
                return_url: route('track.auth', { order: orderCreatedRespose.order_id }), // ✅ 3DS redirects here with order id
            },
            redirect: 'if_required'
        });

        if (error) {
            addToast({
                 type: "error",
                 title: "Payment failed",
                 description: error.message
            });
            setLoading(false);
        } else if (paymentIntent?.status === 'succeeded') {
             // can we send a message with a router visit to show the toast in the intended page 
            setLoading(false);
            router.visit(route('track.auth', { order: orderCreatedRespose.order_id }));
        }
    };

    return (
             <>
            {/* Stripe renders card form here */}
            <PaymentElement   onReady={() => setStripeReady(true)} />

         {stripeReady && (
            <button
                type="button"
                onClick={handleSubmit}

                disabled={!stripe || loading}
                className="w-full mt-4 sticky b-0 py-3 rounded-lg font-semibold text-white transition-all"
                style={{
                    backgroundColor: loading ? '#4f4f6a' : '#6366f1',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Processing...
                    </span>
                ) : 'Pay Now'}
            </button>)}

        </>
    );
}

