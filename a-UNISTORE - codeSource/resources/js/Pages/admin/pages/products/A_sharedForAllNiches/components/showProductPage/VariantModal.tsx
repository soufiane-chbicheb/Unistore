import React, { useState } from "react";
import { X, ShoppingCart, Banknote, Check } from "lucide-react";
import { VariantSchemaType } from "@/shemas/productSchema";
import { ThemePalette } from "@/types/theme";

interface Cover {
  id: number;
  collection: string;
  url: string;
}

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: VariantSchemaType[];
  covers: Cover[];
  productName: string;
  mode: "cart" | "buynow";
  onConfirm: (variant: VariantSchemaType) => void;
  theme?: ThemePalette;
}

const VariantModal: React.FC<VariantModalProps> = ({
  isOpen, onClose, variants, covers, productName, mode, onConfirm, theme,
}) => {
  const [selected, setSelected] = useState<VariantSchemaType | null>(
    variants.find((v) => v.is_default) ?? variants[0] ?? null
  );

  const t = theme;

  if (!isOpen) return null;

  const thumbnail = covers.find((c) => c.collection === "thumbnail")?.url ?? null;

  const getVariantImage = (variant: VariantSchemaType) =>
    variant.image?.url ?? thumbnail ?? "/placeholder.png";

  const getVariantLabel = (variant: VariantSchemaType) => {
    if (!variant.attrs) return `Variant #${variant.variant_id}`;
    return Object.entries(variant.attrs)
      .map(([key, val]) => {
        if (typeof val === "string") return `${key}: ${val}`;
        if (typeof val === "object" && val !== null && "name" in val) return `${key}: ${(val as any).name}`;
        return "";
      })
      .filter(Boolean)
      .join(" · ");
  };

  const getColorHex = (variant: VariantSchemaType): string | null => {
    const color = variant.attrs?.color;
    if (color && typeof color === "object" && "hex" in color) return (color as any).hex;
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm"
      style={{ background: t?.overlay ?? "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg shadow-2xl overflow-hidden"
        style={{
          background: t?.modal ?? t?.bgSecondary ?? "#fff",
          borderRadius: t?.borderRadius ?? "16px",
          color: t?.text,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${t?.border ?? "#e2e8f0"}` }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: t?.text }}>Select Variant</h2>
            <p className="text-sm truncate max-w-xs" style={{ color: t?.textMuted }}>{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{
              background: t?.card ?? "#f1f5f9",
              borderRadius: t?.borderRadius ?? "8px",
              color: t?.textMuted,
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Variant List */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {variants.map((variant, i) => {
            const isSelected = selected?.variant_id === variant.variant_id;
            const hex = getColorHex(variant);
            const outOfStock = (variant.stock ?? 0) === 0;

            return (
              <button
                key={variant.variant_id ?? i}
                onClick={() => !outOfStock && setSelected(variant)}
                disabled={outOfStock}
                className="w-full flex items-center gap-4 p-3 text-left transition-all"
                style={{
                  border: `2px solid ${isSelected ? (t?.primary ?? "#0f172a") : (t?.border ?? "#e2e8f0")}`,
                  background: isSelected ? (t?.card ?? "#f8fafc") : (t?.bgSecondary ?? "#fff"),
                  borderRadius: t?.borderRadius ?? "8px",
                  opacity: outOfStock ? 0.4 : 1,
                  cursor: outOfStock ? "not-allowed" : "pointer",
                  boxShadow: isSelected ? (t?.shadow ?? "0 2px 8px rgba(0,0,0,0.1)") : "none",
                }}
              >
                <div
                  className="w-16 h-16 overflow-hidden flex-shrink-0"
                  style={{ border: `1px solid ${t?.border}`, borderRadius: t?.borderRadius, background: t?.card }}
                >
                  <img src={getVariantImage(variant)} alt={getVariantLabel(variant)} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {hex && <span className="w-4 h-4 rounded-full border flex-shrink-0" style={{ backgroundColor: hex, borderColor: t?.border }} />}
                    <span className="text-sm font-medium truncate" style={{ color: t?.text }}>{getVariantLabel(variant)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold" style={{ color: t?.text }}>{variant.price} MAD</span>
                    {variant.compare_price && variant.compare_price > variant.price && (
                      <span className="text-sm line-through" style={{ color: t?.textMuted }}>{variant.compare_price} MAD</span>
                    )}
                  </div>
                  <span className="text-xs font-medium" style={{ color: outOfStock ? (t?.error ?? "#dc2626") : (t?.success ?? "#16a34a") }}>
                    {outOfStock ? "Out of stock" : `${variant.stock} in stock`}
                  </span>
                </div>

                {isSelected && !outOfStock && (
                  <div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{ background: t?.primary ?? "#0f172a", borderRadius: "4px" }}
                  >
                    <Check className="w-3 h-3" style={{ color: t?.textInverse ?? "#fff" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm */}
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${t?.border}` }}>
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || (selected.stock ?? 0) === 0}
            className="w-full flex items-center justify-center gap-2 py-4 font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: t?.primary ?? "#0f172a",
              color: t?.textInverse ?? "#fff",
              borderRadius: t?.borderRadius ?? "8px",
            }}
          >
            {mode === "cart"
              ? <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
              : <><Banknote className="w-5 h-5" /> Buy Now</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
