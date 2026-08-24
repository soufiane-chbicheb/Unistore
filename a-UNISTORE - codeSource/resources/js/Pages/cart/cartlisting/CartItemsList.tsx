// Pages/Cart/components/CartItemsList.tsx
import { ThemePalette } from "@/types/ThemeTypes";
import CartItemRow from "./CartItemRow";
import CouponCodeInput from "../checkout/CouponCodeInput";

interface CartItemsListProps {
    items: any[];
    theme: ThemePalette;
    coupon_code: string;
    onCouponChange: (code: string) => void;
    onQuantityChange: (itemId: number, newQuantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export default function CartItemsList({
    items,
    theme,
    coupon_code,
    onCouponChange,
    onQuantityChange,
    onRemoveItem,
}: CartItemsListProps) {
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: theme.borderRadius,
            }}
            className="border overflow-hidden"
        >
            {/* Table Header */}
            <div
                style={{
                    backgroundColor: theme.bgSecondary,
                    borderBottomColor: theme.border,
                }}
                className="grid grid-cols-12 gap-4 p-4 border-b font-semibold text-sm"
            >
                <div style={{ color: theme.text }} className="col-span-5">
                    ITEM
                </div>
                <div style={{ color: theme.text }} className="col-span-2 text-center">
                    PRICE
                </div>
                <div style={{ color: theme.text }} className="col-span-3 text-center">
                    QUANTITY
                </div>
                <div style={{ color: theme.text }} className="col-span-2 text-right">
                    TOTAL
                </div>
            </div>

            {/* Cart Items */}
            {items.length === 0 ? (
                <div className="p-12 text-center">
                    <p style={{ color: theme.textMuted }} className="text-lg">
                        Your cart is empty
                    </p>
                </div>
            ) : (
                <>
                    {items.map((item) => (
                        <CartItemRow
                            key={item.id}
                            item={item}
                            theme={theme}
                            onQuantityChange={onQuantityChange}
                            onRemoveItem={onRemoveItem}
                        />
                    ))}

                    {/* Coupon Section */}
                    <div className="p-4">
                        <CouponCodeInput
                            coupon_code={coupon_code}
                            onCouponChange={onCouponChange}
                            theme={theme}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
