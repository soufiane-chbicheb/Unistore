// Pages/Cart/CartPage.tsx
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import Layout from "@/Layouts/Layout";
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import StoreConfigProvider from "@/contextProvoders/StoreConfigProvider";
import { ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";
import StepIndicator from "../shared/StepIndicator";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";
import { useToast } from "@/contextHooks/useToasts";
import axios from "axios";
import { Trash2 } from "lucide-react";
import CartRoadmap from "./CartRoadmap";
import { milliseconds } from "date-fns";

interface CartPageProps {

    onStepChange : (action : 'prev' | 'next' ) => void
}


interface CartProps {
        items: any[];
        defaultShippingAmount : number ,        
        milestones : Milestone[],
        currency : string
    
}



export interface Milestone {
    goal: number;
    label: string;
    type: 'discount' | 'free_shipping';
    estimated_value: number;
    message: string;
    percentage?: number;
    max?: number;
}

export default function CartPage({ items = [], onStepChange }: CartPageProps & { items: any[] }) {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    
    const { defaultShippingAmount, currency } = usePage().props as any;
    const [currAndNextMilestone, setCurrAndNextMilestone] = useState<{
        curr : Milestone | null , 
        next : Milestone
    }|null>(null);

    
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    
    const [coupon_code, setCoupon_code] = useState("");
    const [isRoadmapVisible, setIsRoadmapVisible] = useState(true);
    const [prevReachedCount, setPrevReachedCount] = useState(0);
    const { addToast } = useToast();
    // Calculate totals
    const cartItems = Array.isArray(items) ? items : (items as any)?.data || [];
    
    const subtotal = cartItems.reduce(
        (sum: number, item: any) => sum + (item.price_snapshot || 0) * (item.quantity || 0),
        0
    );
    
    
    // get all promotions check the promotion that gives the best discount for the user invite the user to be qualified for the promotions discount 
    const shipping : number = defaultShippingAmount ;
    
    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        router.patch(
            route("cart.update", itemId),
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onError: (errors) => console.error("Update error:", errors),
            }
        );
    };
    
    const handleRemoveItem = (id: number) => {
        router.delete(route("cart.destroy", { id }), {
            preserveScroll: true,
            onSuccess: () => {
                addToast({
                    type: "success",
                    title: "Item removed from cart",
                });
            },
            onError: () => {
                addToast({
                    type: "error",
                    title: "Error",
                    description: "Failed to remove item",
                });
            }
        });
    };
    
    const handleClearCart = () => {
        if (!confirm("Are you sure you want to clear your cart?")) return;
        
        router.delete(route("cart.clear"), {
            preserveScroll: true,
            onSuccess: () => {
                addToast({
                    type: "success",
                    title: "Cart cleared",
                });
            },
            onError: () => {
                addToast({
                    type: "error",
                    title: "Error",
                    description: "Failed to clear cart",
                });
            }
        });
    };
    
    const handleProceedToCheckout = () => {
        onStepChange('next');
    };
    
    
    
    
    
    useEffect(() => {
        const currentReachedCount = milestones.filter(m => subtotal >= m.goal).length;
        if (currentReachedCount > prevReachedCount) {
            setIsRoadmapVisible(true);
            setPrevReachedCount(currentReachedCount);
        }
    }, [subtotal, milestones, prevReachedCount]);


    useEffect(() => {
        const getBestRewardForUser = async () => {
            const res = await axios.get(route('shipping.calculateBestRewardForUser'))
            if (res.data) {
                if (res.data.milestones) {
                    setMilestones(res.data.milestones);
                    setCurrAndNextMilestone({
                        curr : res.data.currentMilestone || null, 
                        next : res.data.nextMilestone
                   })
                }
            }
        }
        
        if (subtotal > 0) {
            getBestRewardForUser();
        }
    }, [subtotal]);

    


    useEffect(() => {
        if (!currAndNextMilestone?.curr) return;

        const milestone = currAndNextMilestone.curr;
        if (milestone.type === 'discount' && milestone.percentage) {
            const calculatedDiscount = subtotal * (milestone.percentage / 100);
            const scaledValue = milestone.max 
                ? Math.min(calculatedDiscount, milestone.max) 
                : calculatedDiscount;

            if (scaledValue !== milestone.estimated_value) {
                setCurrAndNextMilestone(prev => prev ? ({
                    ...prev,
                    curr: { ...prev.curr!, estimated_value: scaledValue }
                }) : null);
            }
        }
    }, [subtotal, milestones]);

   useEffect(() => {
      console.log("millestones" , milestones)
   }, [milestones]);

    return (
            <div  className="min-h-screen py-6">
                <div className="container mx-auto px-4 max-w-7xl">
                
                     {/* Continue Shopping Button */}
                            <button
                                type="button"
                                onClick={() => router.visit("/")}
                                style={{ color: theme.link }}
                                className="mb-6 flex items-center gap-2 text-sm font-medium hover:underline"
                            >
                                <ArrowLeft size={16} />
                                CONTINUE SHOPPING
                            </button>

                    {isRoadmapVisible && (
                        <div className="mb-8">
                            <CartRoadmap 
                                subtotal={subtotal} 
                                milestones={milestones} 
                                theme={theme} 
                                onClose={() => setIsRoadmapVisible(false)}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2">
                           

                            {/* Cart Header */}
                            <div className="mb-6 flex items-center justify-between">
                          
                                {items.length > 0 && (
                                    <button 
                                        onClick={handleClearCart}
                                        className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                                    >
                                        <Trash2 size={16} />
                                        Clear Cart
                                    </button>
                                )}
                            </div>

                            {/* Cart Items List */}
                            <CartItemsList
                            items={cartItems}
                            theme={theme}
                                coupon_code={coupon_code}
                                onCouponChange={setCoupon_code}
                                onQuantityChange={handleQuantityChange}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            {(() => {
                                const isFreeShippingReached = currAndNextMilestone?.curr?.type === 'free_shipping' || shipping === 0;
                                
                                return (
                                    <CartSummary
                                        subtotal={subtotal}
                                        shipping={subtotal > 0 ? shipping : 0}
                                        nextMilestone={currAndNextMilestone?.next ?? null}
                                        currReachedMilestone={currAndNextMilestone?.curr ?? null}
                                        isFreeShipping={isFreeShippingReached}
                                        itemCount={cartItems.length}
                                        theme={theme}
                                        currency={currency}
                                        onProceedToCheckout={handleProceedToCheckout}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
    );
}
