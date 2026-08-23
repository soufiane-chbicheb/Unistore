import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { ThemePalette } from '@/types/ThemeTypes';
import React from 'react';

const RESPONSIVE_STYLES = `
  .niche-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 3px;
  }
  @media (max-width: 1024px) {
    .niche-grid { grid-template-columns: repeat(2, 1fr); }
    .niche-card { height: 160px !important; }
  }
  @media (max-width: 640px) {
    .niche-grid { grid-template-columns: 1fr; }
    .niche-card { height: 120px !important; }
    .banner-grid { grid-template-columns: 1fr !important; grid-template-rows: unset !important; }
    .banner-grid > *:first-child { grid-row: unset !important; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .banner-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: unset !important; }
    .banner-grid > *:first-child { grid-row: unset !important; grid-column: 1 / -1 !important; }
  }
  .mini-product-card:hover .mini-product-img { transform: scale(1.07); }
  .banner-card:hover .banner-bg-img { transform: scale(1.05) !important; }
`;

interface ProductPreview { image: string; price: string; originalPrice?: string; label: string; }
interface Category { slug: string; image: string; eyebrow: string; title: string; cta: string; span?: 'large' | 'normal'; overlayStrength?: number; products?: ProductPreview[]; }
interface NicheCategory { slug: string; image: string; label: string; count?: string; icon: React.ReactNode; }

const FEATURED_CATEGORIES: Category[] = [
  { slug: 'fashion', image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800', eyebrow: 'Men · Women · Kids', title: 'Fashion', cta: 'Shop Fashion', span: 'large', overlayStrength: 0.52, products: [ { image: 'https://images.pexels.com/photos/2422276/pexels-photo-2422276.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$24.82', originalPrice: '$39.00', label: 'Zip Tracksuit' }, { image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$18.50', label: 'Classic Shirt' }, { image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$7.02', originalPrice: '$15.60', label: 'Gold Bag' } ] },
  { slug: 'electronics', image: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=600', eyebrow: 'Tech', title: 'Electronics', cta: 'Explore', overlayStrength: 0.42, products: [ { image: 'https://images.pexels.com/photos/1042143/pexels-photo-1042143.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$129.00', originalPrice: '$199.00', label: 'Wireless Buds' }, { image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$49.99', label: 'Smart Watch' }, { image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$89.00', label: 'Speaker' } ] },
  { slug: 'beauty', image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600', eyebrow: 'Self-care', title: 'Beauty', cta: 'Browse', overlayStrength: 0.44, products: [ { image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$12.90', label: 'Face Serum' }, { image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$34.00', originalPrice: '$48.00', label: 'Perfume' }, { image: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$9.50', label: 'Lip Gloss Set' } ] },
  { slug: 'home', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600', eyebrow: 'Lifestyle', title: 'Home', cta: 'Browse', overlayStrength: 0.44, products: [ { image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$56.00', label: 'Throw Pillow' }, { image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$22.00', originalPrice: '$35.00', label: 'Ceramic Vase' }, { image: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$15.00', label: 'Candle Set' } ] },
  { slug: 'sports', image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600', eyebrow: 'Active', title: 'Sports', cta: 'Shop Now', overlayStrength: 0.44, products: [ { image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$68.00', originalPrice: '$95.00', label: 'Running Shoes' }, { image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$29.00', label: 'Gym Shorts' }, { image: 'https://images.pexels.com/photos/4162485/pexels-photo-4162485.jpeg?auto=compress&cs=tinysrgb&w=200', price: '$14.99', label: 'Resistance Bands' } ] },
];

const NICHE_CATEGORIES: NicheCategory[] = [
  { slug: 'womenswear', label: 'Womenswear', count: '1,800+', image: 'https://images.pexels.com/photos/2422276/pexels-photo-2422276.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4 C14 4 11 7 11 11 C11 14 13 16 14 17 L10 32 L26 32 L22 17 C23 16 25 14 25 11 C25 7 22 4 18 4Z" /><line x1="14" y1="20" x2="22" y2="20" /></svg> },
  { slug: 'menswear', label: 'Menswear', count: '1,200+', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="14" width="18" height="18" rx="1" /><path d="M13 14 L13 8 L18 11 L23 8 L23 14" /><path d="M9 19 L5 17 L7 14 L13 16" /><path d="M27 19 L31 17 L29 14 L23 16" /></svg> },
  { slug: 'handbags', label: 'Handbags', count: '640+', image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="13" width="24" height="18" rx="2" /><path d="M13 13 C13 9 15 7 18 7 C21 7 23 9 23 13" /><line x1="6" y1="21" x2="30" y2="21" /><circle cx="18" cy="17" r="1.5" /></svg> },
  { slug: 'shoes', label: 'Shoes', count: '980+', image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 24 C4 24 8 16 14 15 C18 14 22 16 27 15 C30 14 32 16 32 19 C32 22 30 24 28 24Z" /><path d="M14 15 L14 10 C14 9 15 8 16 8 L18 8" /></svg> },
  { slug: 'jewellery', label: 'Jewellery', count: '520+', image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="18,5 23,14 32,14 25,20 28,30 18,24 8,30 11,20 4,14 13,14" /></svg> },
  { slug: 'watches', label: 'Watches', count: '310+', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="9" /><line x1="18" y1="12" x2="18" y2="18" /><line x1="18" y1="18" x2="23" y2="21" /><rect x="14" y="4" width="8" height="5" rx="1" /><rect x="14" y="27" width="8" height="5" rx="1" /></svg> },
  { slug: 'fragrance', label: 'Fragrance', count: '190+', image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="11" y="14" width="14" height="18" rx="2" /><rect x="15" y="9" width="6" height="6" rx="1" /><path d="M18 9 L18 6 L21 6" /><path d="M14 5 Q18 2 22 5" /></svg> },
  { slug: 'skincare', label: 'Skincare', count: '430+', image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="18" cy="20" rx="10" ry="12" /><path d="M14 8 Q18 4 22 8" /><line x1="18" y1="8" x2="18" y2="14" /></svg> },
  { slug: 'interiors', label: 'Interiors', count: '760+', image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="28" height="20" rx="1" /><path d="M4 22 L32 22" /><rect x="13" y="14" width="10" height="8" rx="1" /></svg> },
  { slug: 'travel', label: 'Travel', count: '340+', image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="11" y="12" width="14" height="18" rx="2" /><path d="M14 12 L14 9 C14 8 15 7 16 7 L20 7 C21 7 22 8 22 9 L22 12" /><line x1="11" y1="19" x2="25" y2="19" /></svg> },
  { slug: 'kids', label: 'Kids', count: '670+', image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="10" r="5" /><path d="M10 32 C10 24 13 20 18 20 C23 20 26 24 26 32" /></svg> },
  { slug: 'art', label: 'Art', count: '290+', image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400', icon: <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="12" /><circle cx="14" cy="14" r="2.5" /><circle cx="22" cy="13" r="2" /><circle cx="24" cy="21" r="2.5" /><circle cx="14" cy="23" r="2" /></svg> },
];

// ─── Mini Product Card ────────────────────────────────────────────────────────

const MiniProductCard: React.FC<{ product: ProductPreview; theme: ThemePalette; onClick: (e: React.MouseEvent) => void }> = ({ product, theme, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="mini-product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: 'pointer', overflow: 'hidden', background: hovered ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.05)', border: `0.5px solid ${hovered ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)'}`, transition: 'background 0.2s, border-color 0.2s', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', flexShrink: 0 }}>
        <img className="mini-product-img" src={product.image} alt={product.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
      </div>
      <div style={{ padding: '5px 7px 7px', flexShrink: 0 }}>
        <p style={{ fontFamily: '"Jost", sans-serif', fontSize: 9, fontWeight: 300, color: 'rgba(255,255,255,0.6)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: '"Jost", sans-serif', fontSize: 10, fontWeight: 500, color: '#fff' }}>{product.price}</span>
          {product.originalPrice && <span style={{ fontFamily: '"Jost", sans-serif', fontSize: 8.5, fontWeight: 300, color: 'rgba(255,255,255,0.32)', textDecoration: 'line-through' }}>{product.originalPrice}</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Banner Card ──────────────────────────────────────────────────────────────

const BannerCard: React.FC<{ category: Category; style?: React.CSSProperties; onClick: () => void; theme: ThemePalette }> = ({ category, style, onClick, theme }) => {
  const [hovered, setHovered] = React.useState(false);
  const strength = category.overlayStrength ?? 0.44;
  const isLarge = category.span === 'large';
  const hasProducts = (category.products?.length ?? 0) > 0;

  return (
    <div
      className="banner-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', ...style }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', flex: 1, minHeight: isLarge ? 160 : 100, overflow: 'hidden' }}>
        <img
          className="banner-bg-img"
          src={category.image}
          alt={category.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.55s ease', transform: 'scale(1)' }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: hovered
              ? `linear-gradient(160deg, rgba(0,0,0,${strength + 0.18}) 0%, rgba(0,0,0,${strength + 0.04}) 100%)`
              : `linear-gradient(160deg, rgba(0,0,0,${strength + 0.08}) 0%, rgba(0,0,0,${strength - 0.1}) 100%)`,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            padding: '1.1rem 1.1rem 0.9rem', transition: 'background 0.3s',
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 6, fontWeight: 400, fontFamily: '"Jost", sans-serif' }}>{category.eyebrow}</p>
          <h3 style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif', fontSize: isLarge ? '2.5rem' : '1.5rem', fontWeight: 400, color: theme.textInverse, lineHeight: 1.1, marginBottom: 12 }}>{category.title}</h3>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: '"Jost", sans-serif', fontWeight: 300, color: theme.textInverse, borderBottom: '1px solid rgba(255,255,255,0.45)', paddingBottom: 3, width: 'fit-content' }}>{category.cta} →</span>
        </div>
      </div>

      {/* Persistent product strip */}
      {hasProducts && (
        <div
          style={{ flexShrink: 0, background: 'rgba(8,8,8,0.9)', borderTop: '0.5px solid rgba(255,255,255,0.07)', padding: '9px 9px 10px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ fontFamily: '"Jost", sans-serif', fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: theme.accent, marginBottom: 7, fontWeight: 300 }}>Top picks</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
            {category.products!.map((product, i) => (
              <MiniProductCard key={i} product={product} theme={theme} onClick={(e) => { e.stopPropagation(); console.log('Navigate to product:', product.label); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Niche Card — untouched ───────────────────────────────────────────────────

const NicheCard: React.FC<{ niche: NicheCategory; onClick: () => void; theme: ThemePalette }> = ({ niche, onClick, theme }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="niche-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ position: 'relative', height: 140, overflow: 'hidden', borderRadius: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
    >
      <img src={niche.image} alt={niche.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)', filter: hovered ? 'brightness(0.38) saturate(0.55)' : 'brightness(0.5) saturate(0.6)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, width: 34, height: 34, color: '#fff', opacity: 0.92, flexShrink: 0, transition: 'transform 0.3s ease', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}>{niche.icon}</div>
      <span style={{ position: 'relative', zIndex: 1, fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>{niche.label}</span>
      <span style={{ position: 'relative', zIndex: 1, fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.accent, borderBottom: `1px solid ${theme.accent}66`, paddingBottom: 2, marginTop: 2 }}>Shop →</span>
    </div>
  );
};

// ─── Show More Button ─────────────────────────────────────────────────────────

const ShowMoreButton: React.FC<{ open: boolean; onClick: () => void; theme: ThemePalette }> = ({ open, onClick, theme }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.4rem' }}>
      <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick} style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.text, background: hovered ? theme.bgSecondary : 'transparent', border: `0.5px solid ${hovered ? theme.borderHover : theme.border}`, padding: '11px 28px', cursor: 'pointer', borderRadius: 0, display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s, border-color 0.2s' }}>
        <span>{open ? 'Show less' : 'Explore all categories'}</span>
        <span style={{ display: 'inline-block', transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: 12 }}>↓</span>
      </button>
    </div>
  );
};

// ─── Style injector ───────────────────────────────────────────────────────────

const StyleInjector: React.FC = () => {
  React.useEffect(() => {
    const id = 'category-banners-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = RESPONSIVE_STYLES;
      document.head.appendChild(tag);
    }
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CategoryBanners: React.FC = () => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [showAll, setShowAll] = React.useState(false);
  const nicheRef = React.useRef<HTMLDivElement>(null);

  const handleNavigate = (slug: string) => { console.log('Navigate to:', slug); };

  const handleToggle = () => {
    const opening = !showAll;
    setShowAll(opening);
    if (opening) setTimeout(() => nicheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  };

  return (
    <>
      <StyleInjector />
      <section style={{ padding: '4rem 5vw 0' }}>

        <div style={{ marginBottom: '1.8rem' }}>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: theme.accent, marginBottom: 6 }}>Explore our world</p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif', fontSize: '2.4rem', fontWeight: 300, fontStyle: 'italic', color: theme.text, lineHeight: 1 }}>Shop by Category</h2>
        </div>

        <div
          className="banner-grid"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '320px 320px', gap: 3 }}
        >
          <BannerCard category={FEATURED_CATEGORIES[0]} style={{ gridRow: '1 / 3' }} onClick={() => handleNavigate(FEATURED_CATEGORIES[0].slug)} theme={theme} />
          {FEATURED_CATEGORIES.slice(1).map(cat => (
            <BannerCard key={cat.slug} category={cat} onClick={() => handleNavigate(cat.slug)} theme={theme} />
          ))}
        </div>

        <ShowMoreButton open={showAll} onClick={handleToggle} theme={theme} />

        <div ref={nicheRef} style={{ maxHeight: showAll ? '2000px' : '0px', overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
          <div style={{ width: '100%', height: '0.5px', background: theme.border, margin: '1.6rem 0 1.4rem' }} />
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: theme.textMuted, marginBottom: '1rem' }}>All departments</p>
          <div className="niche-grid">
            {NICHE_CATEGORIES.map(niche => (
              <NicheCard key={niche.slug} niche={niche} onClick={() => handleNavigate(niche.slug)} theme={theme} />
            ))}
          </div>
        </div>

      </section>
    </>
  );
};

export default CategoryBanners;
