import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Color, Size } from "@/types/inventoryTypes";
import { ThemePalette } from "@/types/ThemeTypes";
import ColorSelector from "./ColorSection";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

/* ─────────────────────────────────────────
   CSS — injected once into <head>
   Uses real ::before / ::after for the
   deal-box gradient line + corner glow
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.pi-wrap *{box-sizing:border-box;}
.pi-wrap{font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.65;}

.pi-badge-pill{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 14px;border-radius:20px;
  font-size:11px;font-family:'Syne',sans-serif;font-weight:700;letter-spacing:.5px;
  margin-bottom:16px;
}

.pi-prod-title{
  font-family:'Syne',sans-serif;font-size:28px;font-weight:800;
  line-height:1.25;margin:0 0 10px;letter-spacing:-.5px;
}

.pi-rating-row{display:flex;align-items:center;gap:10px;margin-bottom:24px;}
.pi-stars{font-size:14px;letter-spacing:1px;}
.pi-rating-text{font-size:13px;}

.pi-deal-box{
  background:linear-gradient(135deg,#1c1410 0%,#181210 100%);
  border-radius:16px;padding:20px 22px;margin-bottom:24px;
  position:relative;overflow:hidden;
}
.pi-deal-box::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--pi-ac,#e8502a),var(--pi-ac2,#f07340),var(--pi-gold,#d4a843));
}
.pi-deal-box::after{
  content:'';position:absolute;top:-40px;right:-40px;
  width:160px;height:160px;
  background:radial-gradient(circle,rgba(232,80,42,.15) 0%,transparent 70%);
  pointer-events:none;
}

.pi-deal-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:12px;flex-wrap:nowrap;gap:8px;
}
.pi-deal-name{
  font-family:'Syne',sans-serif;font-size:14px;font-weight:700;
  color:var(--pi-ac,#e8502a);letter-spacing:1px;text-transform:uppercase;
  display:flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;
}

.pi-timer{display:flex;align-items:center;gap:4px;font-size:12px;flex-shrink:0;white-space:nowrap;}
.pi-t-digit{
  background:rgba(255,255,255,.07);padding:3px 8px;border-radius:5px;
  font-family:'Syne',sans-serif;font-weight:700;font-size:15px;
  min-width:28px;text-align:center;display:inline-block;
}
.pi-t-sep{font-weight:700;}

.pi-price-row{display:flex;align-items:baseline;gap:14px;}
.pi-price-main{font-family:'Syne',sans-serif;font-size:38px;font-weight:800;}
.pi-save-pill{
  background:linear-gradient(135deg,rgba(232,80,42,.2),rgba(240,115,64,.15));
  color:var(--pi-ac2,#f07340);padding:4px 12px;border-radius:20px;
  font-size:12px;font-weight:700;font-family:'Syne',sans-serif;
}
.pi-price-old{font-size:13px;text-decoration:line-through;margin-top:4px;}
.pi-free-ship{
  background:rgba(34,197,94,.12);color:#4ade80;
  padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;
  font-family:'Syne',sans-serif;
}

.pi-color-label{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;}
.pi-color-label span{font-weight:500;}

.pi-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.pi-tag{padding:5px 14px;border-radius:20px;font-size:12px;background:rgba(255,255,255,.04);letter-spacing:.3px;}

.pi-size-btn{
  padding:8px 20px;border-radius:8px;font-size:13px;font-weight:700;
  cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;min-width:52px;
}
.pi-subcat-btn{
  padding:5px 14px;border-radius:999px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:'DM Sans',sans-serif;
}
.pi-accordion-btn{
  width:100%;display:flex;align-items:center;justify-content:space-between;
  padding:14px 0;background:transparent;border:none;border-bottom:none;
  border-left:none;border-right:none;border-top-style:solid;border-top-width:1px;
  cursor:pointer;font-family:'DM Sans',sans-serif;
}
.pi-accordion-btn span{font-size:15px;font-weight:700;}
.pi-description-body{padding-bottom:16px;font-size:14px;line-height:1.7;font-style:italic;font-weight:300;}
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface Attr { id: number; key: string; value: string; }
interface SubCategory { id: number; name: string; slug?: string; }
interface Variant { id: number; price: number; compare_price?: number; stock: number; }
interface Promotion {
  id: number;
  name: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  valid_until: string | null;
  minimum_order_amount: number | null;
}

interface ProductInfoProps {
  name: string;
  brand: string;
  badgeText?: string;
  badgeColor?: string;
  price: string;
  compareAtPrice?: string;
  stock?: number | string;
  description?: string;
  rating_average?: number | null;
  rating_count?: number | null;
  showCountdown?: boolean;
  promotions?: Promotion[];
  colors: (Color & { variant_id: number })[];
  sizes: Size[];
  product_attributes?: Attr[];
  subCategories?: SubCategory[];
  variants?: Variant[];
  madeCountry?: string | { code: string; name: string };
  theme?: ThemePalette;
  onColorSelect: (color: Color & { variant_id: number }) => void;
  selectedColor?: Color & { variant_id: number };
}

/* ─────────────────────────────────────────
   Fallback promo — shown when promotions[]
   is empty so the deal box is never blank
───────────────────────────────────────── */
function buildFallbackPromo(compareAtPrice?: string, price?: string): Promotion {
  const saved = compareAtPrice && price
    ? Number(compareAtPrice) - Number(price)
    : 20;
  return {
    id: -1,
    name: "Summer Sale",
    type: "fixed",
    value: saved > 0 ? saved : 20,
    valid_until: new Date(Date.now() + 7 * 3600 * 1000 + 22 * 60 * 1000 + 59 * 1000).toISOString(),
    minimum_order_amount: null,
  };
}

function getActiveDeal(promotions: Promotion[], compareAtPrice?: string, price?: string): Promotion {
  const now = new Date();
  const real = promotions
    .filter(p => p.type !== "free_shipping" && (!p.valid_until || new Date(p.valid_until) > now))
    .sort((a, b) => b.value - a.value)[0];
  return real ?? buildFallbackPromo(compareAtPrice, price);
}

/* ─────────────────────────────────────────
   Live countdown hook
───────────────────────────────────────── */
function useCountdown(date: string | null) {
  const calc = () => {
    if (!date) return { h: 0, m: 0, s: 0 };
    const diff = Math.max(0, Math.floor((new Date(date).getTime() - Date.now()) / 1000));
    return { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [date]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [pad(t.h), pad(t.m), pad(t.s)] as const;
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export const ProductInfo: React.FC<ProductInfoProps> = ({
  name, brand, badgeText, badgeColor, price, compareAtPrice, stock, description,
  rating_average, rating_count, showCountdown = true, promotions = [],
  colors, sizes, product_attributes, subCategories, variants, madeCountry,
  theme, onColorSelect, selectedColor,
}) => {
  injectStyles();

  const rootRef = useRef<HTMLDivElement>(null);
  const [showDesc, setShowDesc]         = useState(true);
  const [showDetails, setShowDetails]   = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [displayPrice, setDisplayPrice]     = useState(price);
  const [displayCompare, setDisplayCompare] = useState(compareAtPrice);
  const [displayStock, setDisplayStock]     = useState<number | string | undefined>(stock);

  const t    = theme;
  const ac   = t?.accent      ?? "#e8502a";
  const ac2  = t?.accentHover ?? "#f07340";
  const gold = t?.starColor   ?? "#d4a843";

  const textColor   = t?.text     ?? "#ece9e3";
  const mutedColor  = t?.textMuted ?? "#5a5760";
  const borderColor = t?.border   ?? "rgba(255,255,255,0.06)";

  /* always get a deal — real or fallback */
  const activeDeal      = getActiveDeal(promotions, compareAtPrice, price);
  const hasFreeShipping = promotions.some(p => p.type === "free_shipping");
  const dealDate        = activeDeal.valid_until;
  const [h, m, s]       = useCountdown(dealDate);

  /* push CSS vars so ::before/::after pick up theme colors */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--pi-ac",   ac);
    el.style.setProperty("--pi-ac2",  ac2);
    el.style.setProperty("--pi-gold", gold);
  }, [ac, ac2, gold]);

  useEffect(() => {
    if (colors.length > 0) {
        // Find default variant's color if available, else first color
        const defaultV = variants?.find(v => v.is_default);
        const defaultColor = colors.find(c => c.variant_id === defaultV?.id) || colors[0];
        onColorSelect(defaultColor);
    }
    if (sizes.length > 0)  setSelectedSize(sizes[2] ?? sizes[0]);
  }, []);

  useEffect(() => {
    if (!selectedColor || !variants) return;
    
    // Find variant by ID
    const v = variants.find(v => Number(v.id) === Number(selectedColor.variant_id));
    
    // Fallback: Find first variant with matching color name if ID match fails
    const finalV = v || (selectedColor.name ? variants.find(v => (v as any).attrs?.color === selectedColor.name || (v as any).attrs?.color?.name === selectedColor.name) : null);
    
    if (!finalV) return;
    setDisplayPrice(String(finalV.price));
    setDisplayCompare(finalV.compare_price ? String(finalV.compare_price) : undefined);
    setDisplayStock(finalV.stock);
  }, [selectedColor, variants]);

  const saveAmount = (() => {
    if (activeDeal.type === "fixed")      return activeDeal.value.toFixed(0);
    if (activeDeal.type === "percentage") return (Number(displayPrice) * activeDeal.value / 100).toFixed(0);
    if (displayCompare && Number(displayCompare) > 0)
      return (Number(displayCompare) - Number(displayPrice)).toFixed(0);
    return null;
  })();

  const ratingAvg   = rating_average ?? 0;
  const ratingCount = rating_count   ?? 0;
  const starsStr    = [1,2,3,4,5].map(i => i <= Math.round(ratingAvg) ? "★" : "☆").join("");
  const hasColors   = colors.some(c => c.hex !== null || c.name !== null);

  const accordionBtn: React.CSSProperties = {
    borderTopColor: borderColor,
    color: textColor,
  };

  return (
    <div ref={rootRef} className="pi-wrap" style={{ color: textColor }}>

      {/* ── badge-pill ── */}
      {badgeText && (
        <div className="pi-badge-pill" style={{
          background: badgeColor ? `${badgeColor}22` : "rgba(168,85,247,0.12)",
          color:      badgeColor ?? "#c084fc",
          border:    `1px solid ${badgeColor ? `${badgeColor}44` : "rgba(168,85,247,0.2)"}`,
        }}>
          ⚡ {badgeText}
        </div>
      )}

      {/* ── prod-title ── */}
      <h1 className="pi-prod-title" style={{ color: textColor }}>{name}</h1>

      {/* ── rating-row — always shown, falls back to 0 ── */}
      <div className="pi-rating-row">
        <span className="pi-stars" style={{ color: gold }}>{starsStr}</span>
        <span className="pi-rating-text" style={{ color: mutedColor }}>
          {ratingAvg > 0 ? ratingAvg : "No ratings"}&nbsp;·&nbsp;{ratingCount} reviews&nbsp;·&nbsp;4,000+ sold
        </span>
      </div>

      {/* ══ deal-box — always visible (real promo or fallback) ══ */}
      <div className="pi-deal-box">

        {/* deal-header: name LEFT + timer RIGHT */}
        <div className="pi-deal-header">
          <div className="pi-deal-name">
            🔥 {activeDeal.name}
          </div>
          <div className="pi-timer" style={{ color: mutedColor }}>
            Ends in&nbsp;
            <span className="pi-t-digit" style={{ color: textColor }}>{h}</span>
            <span className="pi-t-sep"   style={{ color: mutedColor }}>:</span>
            <span className="pi-t-digit" style={{ color: textColor }}>{m}</span>
            <span className="pi-t-sep"   style={{ color: mutedColor }}>:</span>
            <span className="pi-t-digit" style={{ color: textColor }}>{s}</span>
          </div>
        </div>

        {/* price-row */}
        <div className="pi-price-row">
          <span className="pi-price-main" style={{ color: t?.priceText ?? textColor }}>
            ${Number(displayPrice).toFixed(0)}
          </span>
          {saveAmount && (
            <span className="pi-save-pill">Save ${saveAmount}</span>
          )}
          {hasFreeShipping && (
            <span className="pi-free-ship">🚚 Free shipping</span>
          )}
        </div>

        {/* price-old */}
        {displayCompare && Number(displayCompare) > 0 && (
          <div className="pi-price-old" style={{ color: t?.priceStrike ?? mutedColor }}>
            was ${Number(displayCompare).toFixed(0)}
          </div>
        )}

        {activeDeal.minimum_order_amount && (
          <div style={{ fontSize: 11, color: mutedColor, marginTop: 6 }}>
            Min. order ${activeDeal.minimum_order_amount} to apply
          </div>
        )}
      </div>

      {/* ── stock badges (shown outside deal box when no compare price) ── */}
      {Number(displayStock) > 0 && Number(displayStock) <= 10 && (
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
            background: `${t?.warning ?? "#f59e0b"}18`,
            color: t?.warning ?? "#f59e0b",
          }}>
            Only {displayStock} left
          </span>
        </div>
      )}
      {(displayStock === 0 || displayStock === "0") && (
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
            background: "rgba(239,68,68,0.1)", color: "#f87171",
          }}>
            Out of stock
          </span>
        </div>
      )}

      {/* ── color-label + swatches ── */}
      {hasColors && (
        <div style={{ marginBottom: 20 }}>
          <ColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
            theme={t}
          />
        </div>
      )}

      {/* ── sizes ── */}
      {sizes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p className="pi-color-label" style={{ color: mutedColor }}>
            Size:&nbsp;<span style={{ color: textColor }}>{selectedSize?.name}</span>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {sizes.map(size => {
              const isSel = selectedSize?.id === size.id;
              return (
                <button
                  key={size.id}
                  className="pi-size-btn"
                  onClick={() => setSelectedSize(size)}
                  style={{
                    background: isSel ? (t?.primary ?? "#0f172a") : "transparent",
                    color:      isSel ? (t?.textInverse ?? "#fff") : textColor,
                    border:    `2px solid ${isSel ? (t?.primary ?? "#0f172a") : borderColor}`,
                  }}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── product_attributes as tag pills ── */}
      {product_attributes && product_attributes.length > 0 && (
        <div className="pi-tags">
          {product_attributes.map(attr => (
            <span key={attr.id} className="pi-tag" style={{ color: mutedColor }}>
              {attr.value}
            </span>
          ))}
        </div>
      )}

      {/* ── sub-categories as accent pills ── */}
      {subCategories && subCategories.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {subCategories.map(cat => (
            <button
              key={cat.id}
              className="pi-subcat-btn"
              onClick={() => router.visit(route("category.show", { slug: cat.slug ?? cat.id }))}
              style={{
                background: `${ac}10`, color: ac,
                border: `1px solid ${ac}25`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Description accordion ── */}
      {description && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="pi-accordion-btn"
            onClick={() => setShowDesc(p => !p)}
            style={accordionBtn}
          >
            <span style={{ color: textColor }}>Description</span>
            <ChevronDown style={{
              width: 18, height: 18, color: mutedColor,
              transition: "transform 0.2s",
              transform: showDesc ? "rotate(180deg)" : "none",
            }} />
          </button>
          {showDesc && (
            <div
              className="pi-description-body"
              style={{ color: t?.textSecondary ?? mutedColor }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      )}

      {/* ── Product Details accordion ── */}
      {madeCountry && (
        <div>
          <button
            type="button"
            className="pi-accordion-btn"
            onClick={() => setShowDetails(p => !p)}
            style={accordionBtn}
          >
            <span style={{ color: textColor }}>Product Details</span>
            <ChevronDown style={{
              width: 18, height: 18, color: mutedColor,
              transition: "transform 0.2s",
              transform: showDetails ? "rotate(180deg)" : "none",
            }} />
          </button>
          {showDetails && (
            <div style={{ paddingBottom: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ width: 96, fontSize: 13, flexShrink: 0, color: mutedColor }}>Made in</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                  {typeof madeCountry === "string" ? madeCountry : madeCountry.name}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProductInfo;
