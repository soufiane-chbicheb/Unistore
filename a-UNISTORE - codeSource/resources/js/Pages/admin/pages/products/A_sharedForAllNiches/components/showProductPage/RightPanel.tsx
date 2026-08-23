import { Color } from "@/types/inventoryTypes";
import { Variant } from "@/types/products/productVariantType";
import { ThemePalette } from "@/types/ThemeTypes";
import { useState } from "react";

const RightPanel = ({
  theme, product, selectedColor, variants, onAddToCart, onBuyNow,
}: {
  theme: ThemePalette; product: any;
  selectedColor?: Color & { variant_id: number };
  variants: Variant[]; onAddToCart: () => void; onBuyNow: () => void;
}) => {
  const [qty, setQty] = useState(1);
  const t = theme;
  const activeVariant = selectedColor
    ? variants.find(v => v.id === selectedColor.variant_id)
    : variants[0];
  const stock = activeVariant?.stock ?? 0;
  const shipping = product.shipping;

  const sBox: React.CSSProperties = {
    background: t.card, borderRadius: 16, padding: 20,
    position: "relative", overflow: "hidden",
  };
  const Glow = () => (
    <div style={{
      position: "absolute", bottom: -30, right: -30, width: 100, height: 100,
      background: `radial-gradient(circle, ${t.accent ?? t.primary}12 0%, transparent 70%)`,
      pointerEvents: "none",
    }} />
  );
  const TrustRow = ({ label, sub }: { label: string; sub?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 13 }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.5)", fontSize: 10,
      }}>✓</div>
      <div>
        <div style={{ color: t.text }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: t.textMuted }}>{sub}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={sBox}>
        <Glow />
        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: t.textMuted, marginBottom: 14 }}>Sold by</p>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: t.bgSecondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🏪</div>
          <div>
            <div style={{ fontWeight: 600, fontFamily: "'Syne',sans-serif", fontSize: 13, color: t.text }}>{product.brand ?? "Store"}</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>Official store</div>
          </div>
        </div>
      </div>

      <div style={sBox}>
        <Glow />
        <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: t.textMuted, marginBottom: 6 }}>Delivery & Returns</p>
        {shipping?.shippingClass && (
          <TrustRow
            label={shipping.shippingClass === "express" ? "Express Shipping" : "Standard Shipping"}
            sub={shipping.shippingCostOverride === 0 ? "Free delivery" : shipping.shippingCostOverride ? `$${shipping.shippingCostOverride}` : undefined}
          />
        )}
        {shipping?.isReturnable && (
          <TrustRow
            label={`${shipping.returnWindow ?? 30}-Day Returns`}
            sub={shipping.returnPolicy === "free_return" ? "Free return" : undefined}
          />
        )}
        <TrustRow label="Secure Checkout" />
        <TrustRow label="Cash on Delivery" />
      </div>

      <div style={sBox}>
        <Glow />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: t.textMuted, marginBottom: 4 }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center", background: t.bgSecondary, borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: t.text, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ width: 40, textAlign: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(stock, q + 1))} style={{ width: 36, height: 36, background: "transparent", border: "none", color: t.text, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          </div>
          <div style={{ fontSize: 11, color: t.textMuted }}>
            {stock > 0 && stock <= 10 && <span style={{ color: t.warning }}>Only {stock} left</span>}
            {stock === 0 && <span style={{ color: t.error }}>Out of stock</span>}
            {stock > 10 && <span>{stock} in stock</span>}
          </div>
        </div>
        <button onClick={onAddToCart} disabled={stock === 0} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: t.text, color: t.bg, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.5px", cursor: stock === 0 ? "not-allowed" : "pointer", opacity: stock === 0 ? 0.4 : 1, marginBottom: 10, transition: "opacity 0.2s" }}>
          Add to Cart
        </button>
        <button onClick={onBuyNow} disabled={stock === 0} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${t.accent ?? t.primary}26, ${t.accentHover ?? t.accent ?? t.primary}1a)`, color: t.accentHover ?? t.accent ?? t.primary, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.5px", cursor: stock === 0 ? "not-allowed" : "pointer", opacity: stock === 0 ? 0.4 : 1, transition: "background 0.2s" }}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default RightPanel ; 
