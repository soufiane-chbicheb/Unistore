import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import ProductImageSlideshow from "@/components/partials/ProductImageSlideshow";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { CardConfig } from "@/types/StoreConfigTypes";
import React from "react";
import { usePage } from "@inertiajs/react";

interface CardProps {
  product: any;
  config: CardConfig;
  onAddToCart?: any;
  onViewDetails?: any;
  selectedElement?: string;
  onSelectElement?: (el: string) => void;
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const paddingMap: Record<string, string> = { tight: 'p-2', normal: 'p-4', loose: 'p-6' };
const cornerMap: Record<string, string> = { sharp: 'rounded-none', 'slightly-rounded': 'rounded-xl', 'extra-rounded': 'rounded-[2.5rem]' };
const thicknessMap: Record<string, string> = { none: 'border-0', thin: 'border', thick: 'border-2' };
const shadowMap: Record<string, string> = { none: 'shadow-none', subtle: 'shadow-md', deep: 'shadow-2xl' };
const hoverMap: Record<string, string> = { none: '', lift: 'hover:-translate-y-2', zoom: 'hover:scale-[1.02]', shadow: 'hover:shadow-2xl' };
const alignMap: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
const aspectMap: Record<string, string> = { '1:1': 'aspect-square', '3:4': 'aspect-[3/4]', '4:3': 'aspect-[4/3]' };
const titleSizeMap: Record<string, string> = { small: 'text-sm', medium: 'text-base', large: 'text-xl' };
const titleWeightMap: Record<string, string> = { normal: 'font-normal', medium: 'font-medium', bold: 'font-extrabold' };
const priceSizeMap: Record<string, string> = { normal: 'text-base', large: 'text-xl', 'extra-large': 'text-2xl' };

// ─── Card1 ───────────────────────────────────────────────────────────────────

const Card1: React.FC<CardProps> = ({ product, config, onAddToCart, onViewDetails, selectedElement, onSelectElement }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const { storeCurrency } = usePage().props as any;

  // If no onSelectElement is provided (e.g. storefront usage), fall back to onViewDetails
  const isEditor = !!onSelectElement;

  const sel = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditor) {
      onSelectElement!(key);
    }
  };

  // Outline helper — only apply in editor mode
  const outlineFor = (key: string, offset = '2px') => {
    if (!isEditor) return '';
    return selectedElement === key
      ? `outline outline-2 outline-blue-500`
      : `hover:outline hover:outline-2 hover:outline-blue-200`;
  };

  return (
    <div
      className={`
        relative flex flex-col group w-full transition-all duration-300
        cursor-pointer pointer-events-auto
        ${paddingMap[config.internalPadding] || 'p-4'}
        ${cornerMap[config.borderCornerStyle] || 'rounded-xl'}
        ${thicknessMap[config.borderThickness] || 'border'}
        ${shadowMap[config.shadow] || 'shadow-md'}
        ${hoverMap[config.hoverAnimation] || ''}
        ${alignMap[config.textAlignment] || ''}
        ${outlineFor('container')}
      `}
      style={{
        background: theme.bg,
        borderColor: theme.border,
        outlineOffset: selectedElement === 'container' ? '-2px' : undefined,
      }}
      onClick={isEditor ? sel('container') : onViewDetails}
    >

      {/* ── IMAGE ─────────────────────────────────────────────── */}
      {config.imageVisibility && (
        <div
          className={`
            relative mb-4 rounded-lg overflow-hidden
            cursor-pointer pointer-events-auto
            ${aspectMap[config.aspectRatio] || 'aspect-square'}
            ${outlineFor('image')}
          `}
          style={{ outlineOffset: '2px' }}
          onClick={sel('image')}
        >
          <ProductImageSlideshow
            images={product.images || [product.image]}
            alt={product.name}
            className={`w-full h-full ${config.imageFitting === 'cover' ? 'object-cover' : 'object-contain'}`}
            productId={product.id}
          />

          {/* Badge overlay — pointer-events-none container, auto on child */}
          {config.showBadges && (
            <div className={`absolute pointer-events-none z-20 p-2 ${
              config.badgePlacement === 'top-left' ? 'top-0 left-0' :
              config.badgePlacement === 'top-right' ? 'top-0 right-0' : 'bottom-0 left-0'
            }`}>
              <span
                className={`pointer-events-auto px-3 py-1 text-[11px] font-black uppercase tracking-tighter ${config.badgeStyle === 'pill' ? 'rounded-full' : 'rounded'}`}
                style={{ background: theme.primary, color: '#fff' }}
              >
                NEW
              </span>
            </div>
          )}

          {/* Wishlist overlay — high z-index, pointer-events-auto */}
          {config.showWishlist && (
            <button
              className={`absolute z-30 pointer-events-auto p-2.5 m-2 rounded-full shadow-lg bg-white/90 hover:bg-white transition-all hover:scale-110 ${
                config.wishlistPlacement === 'top-right' ? 'top-0 right-0' : 'top-0 left-0'
              }`}
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </button>
          )}
        </div>
      )}

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-3">

        {/* BRAND */}
        {config.visibleComponents?.includes('brand') && (
          <div
            className={`cursor-pointer pointer-events-auto ${outlineFor('brand')}`}
            style={{ outlineOffset: '4px' }}
            onClick={sel('brand')}
          >
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
              Sustainable Wood
            </p>
          </div>
        )}

        {/* TITLE */}
        {config.visibleComponents?.includes('title') && (
          <div
            className={`cursor-pointer pointer-events-auto ${outlineFor('title')}`}
            style={{ outlineOffset: '4px' }}
            onClick={sel('title')}
          >
            <h3 className={`
              leading-tight
              ${titleSizeMap[config.titleScale] || 'text-base'}
              ${titleWeightMap[config.titleWeight] || 'font-bold'}
              ${config.titleLineLimit > 0 ? `line-clamp-${config.titleLineLimit}` : ''}
            `}>
              {product?.name}
            </h3>
          </div>
        )}

        {/* RATING (non-selectable) */}
        {config.visibleComponents?.includes('rating') && config.showRating && (
          <div className={`flex items-center gap-1 opacity-70 ${config.textAlignment === 'center' ? 'justify-center' : config.textAlignment === 'right' ? 'justify-end' : ''}`}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-[10px] font-bold">(42)</span>
          </div>
        )}

        {/* PRICE */}
        {config.visibleComponents?.includes('price') && config.showPrice && (
          <div
            className={`cursor-pointer pointer-events-auto ${outlineFor('price')}`}
            style={{ outlineOffset: '4px' }}
            onClick={sel('price')}
          >
            <p className={`font-black ${priceSizeMap[config.priceSize] || 'text-lg'}`} style={{ color: theme.primary }}>
              {product?.price} {storeCurrency}
            </p>
          </div>
        )}

        {/* BUTTON */}
        {config.visibleComponents?.includes('button') && config.buttonPresence !== 'hide' && (
          <div
            className={`
              pt-2 mt-auto
              cursor-pointer pointer-events-auto
              ${config.buttonPresence === 'hover' ? 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500' : ''}
              ${outlineFor('button')}
            `}
            style={{ outlineOffset: '4px' }}
            onClick={sel('button')}
          >
            <button
              className={`
                flex items-center justify-center gap-3 py-3 px-6 font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95
                ${config.buttonWidth === 'full' ? 'w-full' : 'w-auto mx-auto'}
                ${config.buttonTheme === 'outline' ? 'border-2 shadow-none' : 'shadow-xl shadow-blue-500/20'}
              `}
              style={{
                background: config.buttonTheme === 'primary' ? theme.primary : config.buttonTheme === 'secondary' ? theme.secondary : 'transparent',
                color: config.buttonTheme === 'outline' ? theme.primary : '#fff',
                borderColor: config.buttonTheme === 'outline' ? theme.primary : 'transparent',
                pointerEvents: 'none',  // button itself doesn't capture — the wrapper div does
              }}
            >
              <ShoppingCart size={16} strokeWidth={2.5} />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card1;
