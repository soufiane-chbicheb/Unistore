import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Banknote } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";

interface AddToCartProps {
  stock: number | string;
  onBuyNow: () => void;
  onAddToCart: () => void;
  theme?: ThemePalette;
}

const CheckoutButtons: React.FC<AddToCartProps> = ({ stock, onBuyNow, onAddToCart, theme }) => {
  const [quantity, setQuantity] = useState(1);
  const t = theme;
  const stockNumber = typeof stock === "string" ? parseInt(stock) : stock;
  const isOutOfStock = stockNumber === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Qty + Add to Cart row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Quantity control */}
        <div style={{
          display: "flex", alignItems: "center",
          background: t?.card ?? "#f1f5f9",
          borderRadius: t?.borderRadius ?? "10px",
          overflow: "hidden",
        }}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            style={{
              width: 38, height: 42, background: "transparent", border: "none",
              color: t?.text, fontSize: 18, cursor: quantity <= 1 ? "not-allowed" : "pointer",
              opacity: quantity <= 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Minus style={{ width: 14, height: 14 }} />
          </button>
          <span style={{
            width: 44, textAlign: "center", fontWeight: 700, fontSize: 15, color: t?.text,
          }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => Math.min(stockNumber, q + 1))}
            disabled={quantity >= stockNumber || isOutOfStock}
            style={{
              width: 38, height: 42, background: "transparent", border: "none",
              color: t?.text, fontSize: 18, cursor: quantity >= stockNumber ? "not-allowed" : "pointer",
              opacity: quantity >= stockNumber ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "13px 20px", borderRadius: t?.borderRadius ?? "10px", border: "none",
            background: isOutOfStock ? t?.border : t?.primary,
            color: isOutOfStock ? t?.textMuted : t?.textInverse,
            fontWeight: 800, fontSize: 13, letterSpacing: "0.5px",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
          }}
        >
          <ShoppingCart style={{ width: 16, height: 16 }} />
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>

      {/* Buy Now */}
      <button
        onClick={onBuyNow}
        disabled={isOutOfStock}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "13px 20px", borderRadius: t?.borderRadius ?? "10px", border: "none",
          background: `${t?.accent ?? t?.primary}18`,
          color: t?.accent ?? t?.primary,
          fontWeight: 800, fontSize: 13, letterSpacing: "0.5px",
          cursor: isOutOfStock ? "not-allowed" : "pointer",
          opacity: isOutOfStock ? 0.4 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <Banknote style={{ width: 16, height: 16 }} />
        <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
      </button>
    </div>
  );
};

export default CheckoutButtons;
