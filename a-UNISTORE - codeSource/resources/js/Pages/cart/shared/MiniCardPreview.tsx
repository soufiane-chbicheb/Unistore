// Pages/Checkout/components/MiniCartPreview.tsx
import { ThemePalette } from "@/types/ThemeTypes";
import { usePage } from "@inertiajs/react";

interface MiniCartPreviewProps {
    items: any[];
    theme: ThemePalette;
}

export default function MiniCartPreview({
    items = [],
    theme,
}: MiniCartPreviewProps) {
    const { storeCurrency } = usePage().props as any;
    return (
        <div
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: theme.borderRadius,
            }}
            className="border rounded-lg p-4"
        >
            <h3
                style={{ color: theme.text }}
                className="font-semibold mb-4 text-sm"
            >
                Shopping Cart ({items.length} Item{items.length !== 1 ? "s" : ""})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-3 pb-3"
                        style={{ borderBottomColor: theme.border }}
                    >
                        {/* Product Image */}
                        <div
                            style={{
                                backgroundColor: theme.bgSecondary,
                                borderRadius: theme.borderRadius,
                            }}
                            className="w-16 h-16 flex-shrink-0 overflow-hidden"
                        >
                            {item.product_variant.product.thumbnail ? (
                                <img
                                    src={item.product_variant.product.thumbnail.url}
                                    alt={item.product_variant.product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    style={{ color: theme.textMuted }}
                                    className="w-full h-full flex items-center justify-center text-xs"
                                >
                                    No image
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <h4
                                style={{ color: theme.text }}
                                className="font-medium text-sm truncate"
                            >
                                {item.product_variant.product.name}
                            </h4>
                            <p
                                style={{ color: theme.textMuted }}
                                className="text-xs mt-1"
                            >
                                {(item.product_variant.attributes || [])
                                    .map((attr) => attr.value)
                                    .join(", ")}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <span
                                    style={{ color: theme.textSecondary }}
                                    className="text-xs"
                                >
                                    Qty: {item.quantity}
                                </span>
                                <span
                                    style={{ color: theme.text }}
                                    className="font-semibold text-sm"
                                >
                                    {item.price_snapshot} {storeCurrency}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
