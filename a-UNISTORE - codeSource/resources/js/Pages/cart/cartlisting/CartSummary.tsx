import { ThemePalette } from "@/types/ThemeTypes";
import { Gift, Truck } from "lucide-react";
import { Milestone } from "./CartPage";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    itemCount: number;
    theme: ThemePalette;
    nextMilestone: Milestone | null;
    currReachedMilestone : Milestone | null;
    onProceedToCheckout: () => void;
    isFreeShipping : boolean;
    currency: string;
}

export default function CartSummary({
    subtotal,
    shipping,
    itemCount,
    theme,
    nextMilestone,
    currReachedMilestone ,    
    isFreeShipping ,   
    currency,
    onProceedToCheckout,
}: CartSummaryProps) {
    const total = (subtotal ?? 0) + (shipping ?? 0);
   
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.shadowMd,
                borderRadius: theme.borderRadius,
            }}
            className="border rounded-lg p-6 sticky top-4"
        >
            <h3 style={{ color: theme.text }} className="text-lg font-bold mb-4">
                Order Summary
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>
                        Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):
                    </span>
                    <span style={{ color: theme.text }} className="font-semibold">
                        {(subtotal ?? 0).toFixed(2)} {currency}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>Shipping:</span>
                    <span style={{ color: isFreeShipping ? theme.success : theme.text }} className="font-semibold">
                        {isFreeShipping ? "FREE" : `${(shipping ?? 0).toFixed(2)} ${currency}`}
                    </span>
                </div>

                {currReachedMilestone?.type === 'discount' && (
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="flex justify-between text-sm">
                            <span style={{ color: theme.textSecondary }}>
                                Discount ({currReachedMilestone.label}):
                            </span>
                            <span style={{ color: theme.success }} className="font-semibold">
                                - {(currReachedMilestone?.estimated_value ?? 0).toFixed(2)} {currency}
                            </span>
                        </div>
                    </div>
                )}

                {/* Free Shipping Progress */}
                {!isFreeShipping && (
                    <div
                        style={{
                            backgroundColor: theme.warning + "20",
                            color: theme.warning,
                            borderRadius: theme.borderRadius,
                        }}
                        className="text-xs p-2 font-medium flex items-center gap-2 mt-2"
                    >
                        <Gift size={14} className="shrink-0" />
                        <span>{nextMilestone?.message || "Keep shopping to unlock rewards!"}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div style={{ borderColor: theme.border }} className="border-t pt-4 mb-6 space-y-2">
                {currReachedMilestone?.type === 'discount' && (
                    <div className="flex justify-between items-center opacity-60">
                        <span style={{ color: theme.text }} className="text-sm">
                            Original Total:
                        </span>
                        <span style={{ color: theme.text }} className="text-sm line-through">
                            {(subtotal + (isFreeShipping ? 0 : shipping)).toFixed(2)} {currency}
                        </span>
                    </div>
                )}
                
                <div className="flex justify-between items-center">
                    <span style={{ color: theme.text }} className="font-bold text-lg">
                        TOTAL:
                    </span>
                    <div className="text-right">
                        <span style={{ color: theme.primary }} className="font-bold text-2xl block">
                            {(subtotal + (isFreeShipping ? 0 : shipping) - (currReachedMilestone?.type === 'discount' ? currReachedMilestone.estimated_value : 0)).toFixed(2)} {currency}
                        </span>
                        {isFreeShipping && (
                            <span 
                                style={{ color: theme.success }} 
                                className="text-[10px] font-bold uppercase tracking-wider"
                            >
                                + Free Shipping
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
                type="button"
                onClick={onProceedToCheckout}
                disabled={itemCount === 0}
                style={{
                    backgroundColor: theme.primary,
                    color: theme.textInverse,
                    borderRadius: theme.borderRadius,
                }}
                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                PROCEED TO CHECKOUT
            </button>

            {/* Express Checkout Divider */}
            <div className="text-center mb-4">
                <span style={{ color: theme.textMuted }} className="text-xs">
                    OR
                </span>
            </div>

            {/* PayPal Button */}
            <button
                type="button"
                style={{
                    backgroundColor: "#FFC439",
                    color: "#003087",
                    borderRadius: theme.borderRadius,
                }}
                className="w-full py-3 font-bold hover:opacity-90 transition-all mb-6"
            >
                <span className="block text-xs">EXPRESS CHECKOUT</span>
                <span className="text-2xl">Pay</span>
                <span className="text-2xl font-bold">Pal</span>
            </button>

            {/* Money-Back Guarantee */}
            <div
                style={{
                    borderColor: theme.border,
                    color: theme.textSecondary,
                }}
                className="pt-4 border-t flex items-center gap-2 text-xs"
            >
                <span>✓</span>
                <span>30-Day Money-Back Guarantee</span>
            </div>
        </div>
    );
}
