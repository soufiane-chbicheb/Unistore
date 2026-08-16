import React, { useState, useEffect, useRef } from "react";
import MediaGallery from "./MediaGallery";
import { ProductInfo } from "./ProductInfo";
import VariantModal from "./VariantModal";
import RelatedProducts from "./RelatedProducts";
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { VariantSchemaType } from "@/shemas/productSchema";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Color } from "@/types/inventoryTypes";
import { ThemePalette } from "@/types/ThemeTypes";
import {
  Truck, RotateCcw, ShieldCheck, MessageCircle, HelpCircle,
  Store, Check, X, Star, Play,
} from "lucide-react";
import RightPanel from "./RightPanel";
import TrustBar from "./TrustBar";
import SectionHeading from "./SectionHeading";
import VideosSection from "./VideoSection";
import ReviewsBreakDown from "./ReviewBreakDown";

interface ProductDetailProps { onStepChange: (action: "next" | "prev", items?: any[]) => void; }
interface FaqItem { question: string; answer: string; }
interface Variant { id: number; price: number; compare_price?: number; stock: number; }
interface Cover { id: string; url: string; }

/* ─────────────────────────────────────────
   YOUTUBE EMBED HELPER
───────────────────────────────────────── */
function convertYoutubeToEmbed(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/") || url.includes("youtu.be/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.08 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    } as React.CSSProperties,
  };
}


/* ─────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────── */
const Sec = ({ children, divider, theme }: {
  children: React.ReactNode; divider?: boolean; theme: ThemePalette;
}) => (
  <div style={{ paddingBottom: 48, position: "relative" }}>
    {divider && (
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${theme.border ?? "rgba(255,255,255,0.06)"} 30%, ${theme.border ?? "rgba(255,255,255,0.06)"} 70%, transparent 100%)`,
        marginBottom: 48,
      }} />
    )}
    {children}
  </div>
);

/* ─────────────────────────────────────────
   FAQ DRAWER
───────────────────────────────────────── */
const FaqDrawer = ({ faqs, theme, open, onClose }: {
  faqs: FaqItem[]; theme: ThemePalette; open: boolean; onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = theme;
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }} />
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: 340,
        display: "flex", flexDirection: "column",
        background: t.bgSecondary, borderRight: `1px solid ${t.border}`,
        boxShadow: t.shadowLg,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${t.border}`,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.text }}>
            <HelpCircle size={14} /> FAQs
          </span>
          <button onClick={onClose} style={{
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", background: t.card, color: t.textMuted,
            border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 14,
          }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 8, overflowY: "auto" }}>
          {faqs.map((faq, i) => {
            const isActive = activeIndex === i;
            return (
              <button key={i} onClick={() => setActiveIndex(isActive ? null : i)} style={{
                borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 500,
                background: isActive ? t.primary : t.card,
                color: isActive ? t.textInverse : t.text,
                border: `1px solid ${isActive ? t.primary : t.border}`,
                cursor: "pointer", transition: "all 0.2s",
              }}>
                {faq.question.length > 32 ? faq.question.slice(0, 32) + "…" : faq.question}
              </button>
            );
          })}
        </div>
        {activeIndex !== null && (
          <div style={{
            margin: "0 16px 16px", padding: 16,
            background: t.card, border: `1px solid ${t.border}`, borderRadius: 10,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: t.textMuted }}>
              {faqs[activeIndex].question}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: t.text }}>
              {faqs[activeIndex].answer}
            </p>
          </div>
        )}
      </div>
    </>
  );
};




/* ─────────────────────────────────────────
   DESCRIPTION SECTION
───────────────────────────────────────── */
const DescriptionSection = ({ description, theme }: { description: string; theme: ThemePalette }) => {
  if (!description) return null;
  return (
    <>
      <SectionHeading title="About This Product" theme={theme} />
      <div style={{ fontSize: 15, color: theme.textSecondary, lineHeight: 1.8, fontStyle: "italic", fontWeight: 300, maxWidth: 640 }} dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

/* ─────────────────────────────────────────
   SPECS SECTION
───────────────────────────────────────── */
const SpecsSection = ({ product, theme }: { product: any; theme: ThemePalette }) => {
  const t = theme;
  const rows = [
    ...((product?.product_attributes ?? []).filter((a: any) => a !== null).map((a: any) => ({ label: a.key, value: a.value }))),
    product.madeCountry ? { label: "Made In", value: typeof product.madeCountry === "string" ? product.madeCountry : product.madeCountry?.name } : null,
    product.releaseDate ? { label: "Release Year", value: product.releaseDate } : null,
    product.brand ? { label: "Brand", value: product.brand } : null,
  ].filter(Boolean) as { label: string; value: string }[];
  if (!rows.length) return null;
  return (
    <>
      <SectionHeading title="Specifications" theme={t} />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={i} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <td style={{ padding: "13px 0", paddingRight: 20, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", color: t.textMuted, width: "40%" }}>{label}</td>
              <td style={{ padding: "13px 0", fontSize: 13, color: t.text }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};



/* ─────────────────────────────────────────
   FAQs SECTION
───────────────────────────────────────── */
const FaqsSection = ({ faqs, theme }: { faqs: FaqItem[]; theme: ThemePalette }) => {
  const [open, setOpen] = useState<number | null>(null);
  const t = theme;
  if (!faqs?.length) return null;
  return (
    <>
      <SectionHeading title="Questions & Answers" theme={t} />
      {faqs.map((faq, i) => (
        <div key={i} style={{ borderTop: `1px solid ${t.border ?? "rgba(255,255,255,0.04)"}` }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: t.text }}>{faq.question}</span>
            <span style={{ fontSize: 18, fontWeight: 300, color: t.textMuted, display: "inline-block", transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
          </button>
          {open === i && (
            <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7, paddingBottom: 18, margin: 0 }}>{faq.answer}</p>
          )}
        </div>
      ))}
    </>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const ProductDetails = ({ onStepChange }: ProductDetailProps) => {
  const { product } = usePage<any>().props;
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const t = theme;
  console.log(product); // never remove this line

  const [modalOpen, setModalOpen]   = useState(false);
  const [modalMode, setModalMode]   = useState<"cart" | "buynow">("cart");
  const [faqOpen, setFaqOpen]       = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color & { variant_id: number } | undefined>();
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const defaultVariant = product?.variants?.[0];

  useEffect(() => {
    if (!galleryRef.current) return;
    const obs = new IntersectionObserver(([e]) => setGalleryVisible(e.isIntersecting), { threshold: 0 });
    obs.observe(galleryRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!relatedRef.current) return;
    const obs = new IntersectionObserver(([e]) => setSidebarHidden(e.isIntersecting), { threshold: 0.05 });
    obs.observe(relatedRef.current);
    return () => obs.disconnect();
  }, []);

  const shouldShowVariantModal =
    Array.isArray(product?.variants) &&
    product.variants.length > 0 &&
    Number(product.variants[0]?.is_single) === 0;

  const galleryMedia = (product?.covers ?? [])
    .filter((c: any) => c !== null)
    .map((c: any) => ({ 
        id: c.id, 
        url: c.url, 
        variant_id: c.variant_id ? Number(c.variant_id) : undefined,
        color_name: c.color_name
    }));


  const handleAddToCart = () => {
    if (shouldShowVariantModal) { setModalMode("cart"); setModalOpen(true); }
    else router.post(route("cart.store"), { id: product.id, variant_id: defaultVariant?.id });
  };
  const handleBuyNow = () => {
    if (shouldShowVariantModal && !selectedColor) { 
        setModalMode("buynow"); 
        setModalOpen(true); 
    } else {
        const variantToUse = selectedColor 
            ? product.variants.find((v: any) => v.id === selectedColor.variant_id) 
            : defaultVariant;
            
        onStepChange("next", [{
            ...variantToUse,
            name: product.name,
            thumbnail: product.thumbnail,
            quantity: 1,
            price_snapshot: variantToUse?.price
        }]);
    }
  };
  const handleModalConfirm = (variant: VariantSchemaType) => {
    setModalOpen(false);
    if (modalMode === "cart") {
        router.post(route("cart.store"), { id: product.id, variant_id: variant.variant_id });
    } else {
        const variantToUse = product.variants.find((v: any) => v.id === variant.variant_id);
        onStepChange("next", [{
            ...variantToUse,
            name: product.name,
            thumbnail: product.thumbnail,
            quantity: 1,
            price_snapshot: variantToUse?.price
        }]);
    }
  };

  const trustReveal   = useReveal();
  const videosReveal  = useReveal();
  const descReveal    = useReveal();
  const specsReveal   = useReveal();
  const reviewsReveal = useReveal();
  const faqsReveal    = useReveal();

  /* show_reviews: handle boolean true, number 1, or string "1" */
  const showReviews = product.show_reviews == 1 || product.show_reviews === true || (product.reviews?.length > 0);

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto"}}>

        {/* BREADCRUMB */}
        <div style={{ padding: "14px 0", fontSize: 12, color: t.textMuted }}>
          <span style={{ color: t.link ?? t.accent, cursor: "pointer" }}>Home</span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: t.link ?? t.accent, cursor: "pointer" }}>{product?.nich_category?.name ?? "Category"}</span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: t.text }}>{product?.name}</span>
        </div>

        {/* ══ 3-COL GRID ══ */}
        <div style={{
          display: "grid",
          gridTemplateColumns: galleryVisible ? "320px 1fr 290px" : "0px 1fr 290px",
          gap: 32,
          alignItems: "start",
          transition: "grid-template-columns 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}>

          {/* ① GALLERY */}
          <div ref={galleryRef} style={{ alignSelf: "start", overflow: "hidden" }}>
            <MediaGallery selectedColor={selectedColor} media={galleryMedia} video={null} theme={t} />
          </div>

          {/* ② PRODUCT INFO */}
          <div style={{ minWidth: 0 }}>
            <ProductInfo
              name={product.name}
              brand={product.brand ?? ""}
              badgeText={product.badge?.name ?? undefined}
              badgeColor={product.badge?.color ?? undefined}
              rating_average={product.rating_average ?? null}
              rating_count={product.rating_count ?? 0}
              price={String(defaultVariant?.price ?? 0)}
              compareAtPrice={defaultVariant?.compare_price ? String(defaultVariant.compare_price) : undefined}
              stock={defaultVariant?.stock ?? 0}
              description={product.description ?? ""}
              colors={(product?.colors ?? []).filter((c: any) => c !== null)}
              sizes={(product?.sizes ?? []).filter((s: any) => s !== null)}
              product_attributes={(product?.product_attributes ?? []).filter((a: any) => a !== null)}
              subCategories={(product?.sub_categories ?? []).filter((sc: any) => sc !== null)}
              variants={(product?.variants ?? []).filter((v: any) => v !== null)}
              madeCountry={product?.madeCountry ?? undefined}
              showCountdown={product?.show_countdown == 1 || product?.show_countdown === true}

              promotions={product.promotions ?? []}
              theme={t}
              onColorSelect={(color: Color & { variant_id: number }) => setSelectedColor(color)}
              selectedColor={selectedColor}
            />
          </div>

          {/* ③ STICKY SIDEBAR */}
          <div style={{
            position: "sticky", top: 24, alignSelf: "start",
            opacity: sidebarHidden ? 0 : 1,
            transform: sidebarHidden ? "translateX(16px)" : "none",
            pointerEvents: sidebarHidden ? "none" : "auto",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            <RightPanel
              theme={t} product={product}
              selectedColor={selectedColor}
              variants={product.variants ?? []}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>

          {/* ④ BELOW-HERO — spans col 1+2 */}
          <div style={{ gridColumn: "1 / 3", minWidth: 0 }}>

            <div ref={trustReveal.ref} style={trustReveal.style}>
              <Sec theme={t}>
                <TrustBar shipping={product.shipping} promotions={product.promotions ?? []} theme={t} />
              </Sec>
            </div>

            {product.videos?.length > 0 && (
              <div ref={videosReveal.ref} style={videosReveal.style}>
                <Sec divider theme={t}>
                  <VideosSection videos={product.videos} theme={t} />
                </Sec>
              </div>
            )}

            {product.description && (
              <div ref={descReveal.ref} style={descReveal.style}>
                <Sec divider theme={t}>
                  <DescriptionSection description={product.description} theme={t} />
                </Sec>
              </div>
            )}

            <div ref={specsReveal.ref} style={specsReveal.style}>
              <Sec divider theme={t}>
                <SpecsSection product={product} theme={t} />
              </Sec>
            </div>

            {/* show_reviews — truthy check, not strict === 1 */}
            {showReviews && (
              <div ref={reviewsReveal.ref} style={reviewsReveal.style}>
                <Sec divider theme={t}>
                  <ReviewsBreakDown product={product} theme={t} />
                </Sec>
              </div>
            )}

            {product.faqs?.length > 0 && (
              <div ref={faqsReveal.ref} style={faqsReveal.style}>
                <Sec divider theme={t}>
                  <FaqsSection faqs={product.faqs} theme={t} />
                </Sec>
              </div>
            )}

          </div>

          {/* ⑤ RELATED — full width */}
          <div ref={relatedRef} style={{ gridColumn: "1 / -1", paddingBottom: 80 }}>
            {(product.show_related_products == 1 || product.show_related_products === true) && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 8, marginBottom: 28 }}>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 700, color: t.text, whiteSpace: "nowrap" }}>You Might Also Like</h2>
                  <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${t.border ?? "rgba(255,255,255,0.07)"} 0%, transparent 100%)` }} />
                </div>
                <RelatedProducts theme={t} />
              </>
            )}
          </div>

        </div>
      </div>

      {/* FLOATING BUTTONS */}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 12, zIndex: 39 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 999, background: t.card, color: t.text, border: `1px solid ${t.border}`, boxShadow: t.shadowMd, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <MessageCircle size={15} /> Chat with us
        </button>
        {product.faqs?.length > 0 && (
          <button onClick={() => setFaqOpen(p => !p)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 999, background: faqOpen ? t.primary : t.card, color: faqOpen ? t.textInverse : t.text, border: `1px solid ${faqOpen ? t.primary : t.border}`, boxShadow: t.shadowMd, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <HelpCircle size={15} /> FAQs
          </button>
        )}
      </div>

      {product.faqs?.length > 0 && (
        <FaqDrawer faqs={product.faqs} theme={t} open={faqOpen} onClose={() => setFaqOpen(false)} />
      )}

      <VariantModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        variants={(product?.variants ?? []).filter((v: any) => v !== null)}
        covers={(product?.covers ?? []).filter((c: any) => c !== null)}
        productName={product.name}
        mode={modalMode}
        onConfirm={handleModalConfirm}
        theme={t}
      />
    </div>
  );
};

export default ProductDetails;

