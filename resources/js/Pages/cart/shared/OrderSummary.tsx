// Pages/Checkout/components/OrderSummaryCard.tsx
import { ThemePalette } from "@/types/ThemeTypes";
import { Lock, Tag } from "lucide-react";
import { usePage } from "@inertiajs/react";

interface OrderSummaryCardProps {
    subtotal: number;
    tax: number;
    total: number;
    discount?: number;
    coupon_code?: string;
    onPromoChange?: (code: string) => void;
    theme: ThemePalette;
    itemCount: number;
    showPromoCode?: boolean;
    showSecurityBadge?: boolean;
    ctaButton?: React.ReactNode; // Custom CTA button
    applyCouponWithFeedback? : () => void , 
    zone? : {estimated_days : number , price : number}
}

export default function OrderSummaryCard({
    subtotal,
    tax,
    total,
    discount = 0,
    coupon_code = "",
    onPromoChange,
    theme,
    itemCount,
    showPromoCode = false,
    showSecurityBadge = false,
    ctaButton,
    applyCouponWithFeedback , 
    zone
}: OrderSummaryCardProps) {
    const { storeCurrency } = usePage().props as any;
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                boxShadow: theme.shadowMd,
                borderRadius: theme.borderRadius,
            }}
            className="border rounded-lg p-6"
        >
            <h3
                style={{ color: theme.text }}
                className="text-lg font-bold mb-4"
            >
                Order Summary
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>
                        Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):
                    </span>
                    <span style={{ color: theme.text }} className="font-semibold">
                        {subtotal} {storeCurrency}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>Shipping:</span>
                    <span
                        style={{
                            color: zone?.price === 0 ? theme.success : theme.text,
                        }}
                        className="font-semibold"
                    >
                        {zone?.price === 0 ? (
                            <span className="flex items-center gap-1">
                                FREE
                                <span className="text-xs">✓</span>
                            </span>
                        ) : (
                            `${zone?.price} ${storeCurrency}`
                        )}
                    </span>
                </div>

                {subtotal < 50 && (((zone?.price) ?? 0) > 0 )&& (
                    <div
                        style={{
                            backgroundColor: theme.warning + "20",
                            color: theme.warning,
                            borderRadius: theme.borderRadius,
                        }}
                        className="text-xs p-2 mt-2"
                    >
                        Add {(50 - subtotal)} {storeCurrency} more for FREE shipping!
                    </div>
                )}

                <div className="flex justify-between text-sm">
                    <span style={{ color: theme.textSecondary }}>
                        Tax (10%):
                    </span>
                    <span style={{ color: theme.text }} className="font-semibold">
                        {tax} {storeCurrency}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span style={{ color: theme.success }}>
                            Discount:
                        </span>
                        <span
                            style={{ color: theme.success }}
                            className="font-semibold"
                        >
                            - {discount} {storeCurrency}
                        </span>
                    </div>
                )}
            </div>

            {/* Promo Code */}
            {showPromoCode && onPromoChange && (
                <div className="mb-4">
                    <label
                        style={{ color: theme.textSecondary }}
                        className="block text-xs mb-2 flex items-center gap-1"
                    >
                        <Tag size={14} />
                        Promo Code
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={coupon_code}
                            onChange={(e) => onPromoChange(e.target.value)}
                            style={{
                                borderColor: theme.border,
                                backgroundColor: theme.bgSecondary,
                                color: theme.text,
                                borderRadius: theme.borderRadius,
                            }}
                            className="flex-1 border px-3 py-2 text-sm focus:outline-none"
                            placeholder="Enter code"
                        />
                        <button
                            type="button"
                            onClick={applyCouponWithFeedback}
                            style={{
                                backgroundColor: theme.secondary,
                                color: theme.text,
                                borderRadius: theme.borderRadius,
                            }}
                            className="px-4 py-2 text-sm font-medium hover:opacity-80"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Total */}
            <div
                style={{ borderColor: theme.border }}
                className="border-t pt-4 mb-6"
            >
                <div className="flex justify-between items-center">
                    <span
                        style={{ color: theme.text }}
                        className="text-lg font-bold"
                    >
                        Total:
                    </span>
                    <span
                        style={{ color: theme.primary }}
                        className="text-2xl font-black"
                    >
                        {total} {storeCurrency}
                    </span>
                </div>
            </div>

            {/* Custom CTA Button */}
            {ctaButton}

            {/* Security Badge */}
            {showSecurityBadge && (
                <div
                    style={{
                        borderColor: theme.border,
                        color: theme.textMuted,
                    }}
                    className="flex items-center justify-center gap-3 pt-4 border-t text-xs"
                >
                    <Lock size={14} />
                    <span>Secure Checkout • SSL Protected</span>
                </div>
            )}
        </div>
    );
}
