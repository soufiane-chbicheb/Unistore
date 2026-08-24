// Pages/Cart/components/CartItemRow.tsx
import { ThemePalette } from "@/types/ThemeTypes";
import { Plus, Minus, Trash2 } from "lucide-react";
import { usePage } from "@inertiajs/react";

interface CartItemRowProps {
    item: any;
    theme: ThemePalette;
    onQuantityChange: (itemId: number, newQuantity: number) => void;
    onRemoveItem: (itemId: number) => void;
}

export default function CartItemRow({
    item,
    theme,
    onQuantityChange,
    onRemoveItem,
}: CartItemRowProps) {
    const { storeCurrency } = usePage().props as any;
    return (
        <div
            style={{
                borderBottomColor: theme.border,
            }}
            className="grid grid-cols-12 gap-4 p-4 border-b items-center"
        >
            {/* Item Info */}
            <div className="col-span-5 flex gap-4">
                {/* Product Image */}
                <div
                    style={{
                        backgroundColor: theme.bgSecondary,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-20 h-20 flex-shrink-0 overflow-hidden"
                >
                    {item.product_variant?.product?.thumbnail ? (
                        <img
                            src={item.product_variant.product.thumbnail.url}
                            alt={item.product_variant.product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            style={{
                                color: theme.textMuted,
                            }}
                            className="w-full h-full flex items-center justify-center text-xs"
                        >
                            No image
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                    <h3
                        style={{
                            color: theme.text,
                        }}
                        className="font-medium mb-1"
                    >
                        {item.product_variant?.product?.name || 'Unknown Product'}
                    </h3>
                    <p
                        style={{
                            color: theme.textMuted,
                        }}
                        className="text-sm"
                    >
                        {item.product_variant?.sku || 'No SKU'}
                    </p>
                    <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                            color: theme.error,
                        }}
                        className="text-xs hover:underline mt-2 flex items-center gap-1"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="col-span-2 text-center">
                <span style={{ color: theme.text }} className="font-semibold">
                    {item.price_snapshot} {storeCurrency}
                </span>
            </div>

            {/* Quantity Controls */}
            <div className="col-span-3 flex items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    style={{
                        backgroundColor: theme.bgSecondary,
                        borderColor: theme.border,
                        color: theme.text,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-8 h-8 border flex items-center justify-center hover:opacity-80"
                    disabled={item.quantity <= 1}
                >
                    <Minus size={14} />
                </button>

                <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    style={{
                        backgroundColor: theme.bgSecondary,
                        borderColor: theme.border,
                        color: theme.text,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-12 h-8 border text-center font-semibold"
                />

                <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    style={{
                        backgroundColor: theme.bgSecondary,
                        borderColor: theme.border,
                        color: theme.text,
                        borderRadius: theme.borderRadius,
                    }}
                    className="w-8 h-8 border flex items-center justify-center hover:opacity-80"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Item Total */}
            <div className="col-span-2 text-right">
                <span style={{ color: theme.text }} className="font-bold">
                    {(item.price_snapshot * item.quantity)} {storeCurrency}
                </span>
            </div>
        </div>
    );
}
