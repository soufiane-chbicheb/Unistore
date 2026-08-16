import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCardMaster from '@/components/partials/ProductCardMaster';

import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { ProductSection } from '@/types/HomeFeedTypes';

const DEFAULT_CARDS_VISIBLE = 5;
const CARD_GAP              = 24;   // px between cards
const TRACK_PADDING         = 80;   // px left & right

interface ScrollRowProps {
  section: ProductSection;
  onViewAll?: (key: string) => void;
  cardsVisible?: number;
}

export const ScrollRow: React.FC<ScrollRowProps> = ({
  section,
  onViewAll,
  cardsVisible = DEFAULT_CARDS_VISIBLE,
}) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const sliderRef  = useRef<HTMLDivElement>(null);
  const windowRef  = useRef<HTMLDivElement>(null);   // the overflow:hidden viewport

  const [offset, setOffset] = useState(0);
  const [cardW,  setCardW]  = useState(0);
  const [visibleN, setVisible] = useState(cardsVisible);

  const total     = section.products.length;

  // ── Compute card width from the *window* element (already padded) ──────────
  useEffect(() => {
    const compute = () => {
      if (!windowRef.current) return;
      const trackW = windowRef.current.offsetWidth;          // already excludes TRACK_PADDING
      const vw     = window.innerWidth;
      const n      = vw <= 600 ? 1 : vw <= 1024 ? 2 : cardsVisible;
      setVisible(n);
      setCardW((trackW - CARD_GAP * (n - 1)) / n);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [cardsVisible]);

  // ── Slide ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sliderRef.current || !cardW) return;
    sliderRef.current.style.transform =
      `translateX(-${offset * (cardW + CARD_GAP)}px)`;
  }, [offset, cardW]);

  const maxOffset = Math.max(0, total - visibleN);
  const scroll = (dir: 'left' | 'right') =>
    setOffset(prev => Math.max(0, Math.min(maxOffset, prev + (dir === 'left' ? -1 : 1))));

  // image area height ≈ card width * (4/3)  → arrow sits at 40% of that
  const imageAreaHeight = cardW ? cardW * (4 / 3) : 300;

  return (
    <div style={{ marginBottom: '3.5rem', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `28px ${TRACK_PADDING}px 22px`,
      }}>
        <h2 style={{
          fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
          fontSize: '2rem',
          fontWeight: 500,
          color: theme.text,
          margin: 0,
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {section.emoji && <span style={{ fontSize: '1.5rem' }}>{section.emoji}</span>}
          {section.name}
        </h2>

        {onViewAll && (
          <button
            onClick={() => onViewAll(section.key)}
            style={{
              padding: '11px 28px',
              borderRadius: theme.borderRadius,
              border: `1.5px solid ${theme.border}`,
              background: 'transparent',
              color: theme.text,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap' as const,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = theme.text;
              e.currentTarget.style.color       = theme.bg;
              e.currentTarget.style.borderColor = theme.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.color       = theme.text;
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            VIEW ALL &nbsp;→
          </button>
        )}
      </div>

      {/* ── Arrow buttons — overlayed, centered on image area ── */}
      {(['left', 'right'] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => scroll(dir)}
          style={{
            position: 'absolute',
            top:       `calc(${28 + 22}px + ${imageAreaHeight * 0.42}px)`,   // header height + 42% into image
            transform: 'translateY(-50%)',
            [dir === 'left' ? 'left' : 'right']: TRACK_PADDING - 18,         // sits just inside the track edge
            zIndex: 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `1px solid ${theme.border}`,
            background: theme.bg,
            color: theme.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: dir === 'left' ? (offset === 0 ? 'default' : 'pointer') : (offset >= maxOffset ? 'default' : 'pointer'),
            transition: 'opacity 0.18s, border-color 0.18s',
            opacity: dir === 'left' ? (offset === 0 ? 0.25 : 1) : (offset >= maxOffset ? 0.25 : 1),
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; }}
        >
          {dir === 'left' ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
        </button>
      ))}

      {/* ── Viewport window — THIS is what clips. Padded margins = nothing leaks. ── */}
      <div
        ref={windowRef}
        style={{
          marginInline: TRACK_PADDING,   // <-- padding lives HERE as margin
          overflow: 'hidden',            // <-- clips exactly at padded boundary
        }}
      >
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: CARD_GAP,
            transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {section.products.map((product) => (
            <div
              key={product.id}
              style={{
                width:    cardW || `calc((100% - ${CARD_GAP * (cardsVisible - 1)}px) / ${cardsVisible})`,
                minWidth: cardW || `calc((100% - ${CARD_GAP * (cardsVisible - 1)}px) / ${cardsVisible})`,
                flexShrink: 0,
              }}
            >
              <div className="sr-card-inner">
                <ProductCardMaster key={product.id}  product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strip all ProductCardMaster chrome */}
      <style>{`
        .sr-card-inner > div {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: ${theme.bg} !important;
          padding: 0 !important;
        }
        .sr-card-inner > div img {
          width: 100% !important;
          aspect-ratio: 3 / 4 !important;
          object-fit: cover !important;
          border-radius: 0 !important;
          display: block !important;
          transition: none !important;
          transform: none !important;
        }
        .sr-card-inner > div:hover { transform: none !important; box-shadow: none !important; }
        .sr-card-inner > div:hover img { transform: none !important; }
        .sr-card-inner > div > div[style*="opacity"] { opacity: 0 !important; pointer-events: none !important; }
      `}</style>
    </div>
  );
};

export default ScrollRow;
