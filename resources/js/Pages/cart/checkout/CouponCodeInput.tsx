// Pages/Checkout/components/CouponCodeInput.tsx
import { ThemePalette } from "@/types/ThemeTypes";
import { Tag } from "lucide-react";

interface CouponCodeInputProps {
    coupon_code: string;
    onCouponChange: (code: string) => void;
    theme: ThemePalette;
}

export default function CouponCodeInput({
    coupon_code,
    onCouponChange,
    theme,
}: CouponCodeInputProps) {
    return (
        <div className="flex items-center justify-end gap-4">
            <label
                style={{ color: theme.textSecondary }}
                className="text-sm flex items-center gap-2"
            >
                <Tag size={16} />
                Coupon or gift card:
            </label>
            <input
                type="text"
                value={coupon_code}
                onChange={(e) => onCouponChange(e.target.value)}
                placeholder="Enter code"
                style={{
                    backgroundColor: theme.bgSecondary,
                    borderColor: theme.border,
                    color: theme.text,
                    borderRadius: theme.borderRadius,
                }}
                className="border px-3 py-2 text-sm w-48 focus:outline-none"
            />
            <button
                type="button"
                style={{
                    backgroundColor: theme.text,
                    color: theme.textInverse,
                    borderRadius: theme.borderRadius,
                }}
                className="px-6 py-2 text-sm font-medium hover:opacity-90"
            >
                APPLY
            </button>
        </div>
    );
}
