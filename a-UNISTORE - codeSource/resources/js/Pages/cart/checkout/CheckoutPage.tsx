// Pages/Checkout/CheckoutPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import {  useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import PageHeader from "../shared/PageHeader";
import PaymentMethodOptions from "./PaymentMethodOptions";
import CardPaymentForm from "./CardPaymentForm";
import MiniCartPreview from "../shared/MiniCardPreview";
import OrderSummaryCard from "../shared/OrderSummary";
import ShippingAddressReview from "./ShippingAddressReview";
import axios from "axios";
import { useToast } from "@/contextHooks/useToasts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

type PaymentMethod = "COD" | "CARD";

interface CheckoutPageProps {
    items: any[];
    tax: number;
    shippingData: any;
    onStepChange : (action : 'prev' | 'next' ) => void , 
    onChangeBackendErrors : ( errors : any) => void
    onResetShippingData : () => void , 
    postUrl : string,
    zone : any
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
export default function CheckoutPage({ postUrl , items = [], tax, shippingData ,onStepChange  ,onChangeBackendErrors , onResetShippingData, zone }: CheckoutPageProps) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    const [payment_method, setPayment_method] = useState<PaymentMethod>("CARD");
    const [orderCreatedRespose, setOrderCreatedRespose] = useState({
        client_secret : undefined, 
        order_id : undefined
    });
    const [coupon_code, setCoupon_code] = useState("");
    const [discount, setDiscount] = useState(0);
    const {addToast} = useToast()
    const cartItems = Array.isArray(items) ? items : (items as any)?.data || [];

    const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (Number(item.price_snapshot) || 0) * (Number(item.quantity) || 0),
        0
    );
    const shipping = Number(zone?.price ?? 0);
    const total = subtotal + shipping + tax + discount;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const orderData = {
            ...shippingData,
            payment_method,
            coupon_code: coupon_code || null,
        };

        router.post(route('order.checkout'), orderData, {
            onSuccess: (page : any) => {
                    const {client_secret , order_id} = page.props.flash ;

                    setOrderCreatedRespose({
                        client_secret ,
                        order_id
                    })
                    setCoupon_code("")
                    setDiscount(0)
                    // onResetShippingData()
                    onChangeBackendErrors([])
            },
            onError: (errors) => {
                  window.history.pushState({}, '', '/checkout?step=payment');
                  if (errors?.submit) {
                        addToast({
                        type: "error",
                        title: "Order failed",
                        description: Array.isArray(errors.submit) ? errors.submit[0] : errors.submit,
                        });
                    }
                onChangeBackendErrors(errors)
            },
        });
    };

    const applyCouponWithFeedback = async () => {
        try{
            const res = await axios({method:"POST" , url : route("coupon.feedback") , data : {coupon_code}}) ; 
            if(res){
                 if (res.data.success) {
                        setDiscount(-10.0);
                        addToast({
                        type: "success",
                        title: "Coupon Valid",
                        description: Array.isArray(res.data.success) ? res.data.success[0] : res.data.success,
                        });
                    }
            }

        }catch(err : any){
               const errorMessage = err.response?.data?.error || 'Failed to apply coupon';
                if(errorMessage){
                    addToast({
                            type: "error",
                            title: "Coupon failed",
                            description: errorMessage,
                            });
                }
        }

    }
   

    return (
                <div
                style={{ backgroundColor: theme.bg }}
                className="min-h-screen py-8"
            >
                <div className="container mx-auto px-4 max-w-7xl">
                    <form onSubmit={handlePlaceOrder}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Payment Options */}
                            <div className="lg:col-span-2 space-y-6">
                                <div
                                    style={{
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                    }}
                                    className="rounded-lg border p-6"
                                >
                                    <PageHeader
                                        title="Payment Method"
                                        backLink={() => onStepChange('prev')}
                                        backLabel="Back to Shipping"
                                        theme={theme}
                                    />

                                    <PaymentMethodOptions
                                        payment_method={payment_method}
                                        onPaymentMethodChange={setPayment_method}
                                        theme={theme}
                                    />
                                </div>

                                {/* Shipping Address Review */}
                                <ShippingAddressReview {...{ onStepChange , shippingData  , theme}}  />
                            
                            </div>

                            {/* Right: Mini Cart + Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-4 space-y-4">
                                    <MiniCartPreview
                                        items={cartItems}
                                        theme={theme}
                                    />

                                    <OrderSummaryCard
                                        zone={zone}
                                        applyCouponWithFeedback={applyCouponWithFeedback}
                                        subtotal={subtotal}
                                        tax={tax}
                                        total={total}
                                        discount={discount}
                                        coupon_code={coupon_code}
                                        onPromoChange={setCoupon_code}
                                        theme={theme}
                                        itemCount={cartItems.length}
                                        showPromoCode={true}
                                        showSecurityBadge={true}
                                        ctaButton={
                                            <button
                                                type="submit"
                                                style={{
                                                    backgroundColor: theme.primary,
                                                    color: theme.textInverse,
                                                    borderRadius: theme.borderRadius,
                                                }}
                                                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-3"
                                            >
                                                {payment_method === "COD"
                                                    ? "Place Order (COD)"
                                                    : "Proceed to Payment"}
                                            </button>
                                        }
                                    />
                                        {/* stripe payment form  */}
                                {orderCreatedRespose.client_secret && (
                                        <>
                                            <div
                                                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                                                className="fixed inset-0 z-40"
                                                onClick={() => setOrderCreatedRespose({ client_secret: undefined, order_id: undefined })}
                                            />

                                            {/* wrapper — same color as stripe form background */}
                                            <div
                                                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-xl shadow-2xl p-6"
                                                style={{ backgroundColor: '#27272a' }} // ← matches colorBackground
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* header */}
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <h2 className="text-white text-lg font-semibold">Complete Payment</h2>
                                                        <p className="text-zinc-400 text-sm mt-0.5">Secured by Stripe</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setOrderCreatedRespose({ client_secret: undefined, order_id: undefined })}
                                                        className="text-zinc-400 hover:text-white"
                                                    >✕</button>
                                                </div>

                                                <Elements
                                                    stripe={stripePromise}
                                                    options={{
                                                        clientSecret: orderCreatedRespose.client_secret,
                                                        appearance: {
                                                            theme: 'night',
                                                            variables: {
                                                                colorBackground: '#27272a', // same as wrapper
                                                                colorText: '#ffffff',
                                                                colorTextSecondary: '#a1a1aa',
                                                                colorIconTab: '#ffffff',
                                                                borderRadius: '8px',
                                                                colorPrimary: '#6366f1',
                                                            },
                                                            rules: {
                                                                '.Input': {
                                                                    backgroundColor: '#3f3f46',
                                                                    border: '1px solid #52525b',
                                                                    color: '#ffffff',
                                                                },
                                                                '.Input:focus': {
                                                                    border: '1px solid #6366f1',
                                                                    boxShadow: 'none',
                                                                },
                                                                '.Label': {
                                                                    color: '#a1a1aa',
                                                                },
                                                                // ← remove stripe form container border
                                                                '.Block': {
                                                                    border: 'none',
                                                                    boxShadow: 'none',
                                                                    backgroundColor: '#27272a',
                                                                },
                                                                '.Tab': {
                                                                    border: '1px solid #52525b',
                                                                    backgroundColor: '#3f3f46',
                                                                },
                                                                '.Tab--selected': {
                                                                    border: '1px solid #6366f1',
                                                                },
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <CardPaymentForm orderCreatedRespose={orderCreatedRespose} />
                                                </Elements>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
               
    );
}



