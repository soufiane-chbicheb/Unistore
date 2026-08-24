import React, { useState, useEffect, useCallback } from 'react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

// ─────────────────────────────────────────────
//  DATA — each panel IS a slide
// ─────────────────────────────────────────────
interface Slide {
  id: number;
  image_url: string;
  tag: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  panel_label: string;
  panel_title: string;
  panel_bg: string;
  order: number;
}

interface SliderData {
  id: number;
  name: string;
  autoplay_speed: number;
  show_arrows: boolean;
  show_dots: boolean;
  slides: Slide[];
}

interface HeroSliderProps {
  slider?: SliderData | null;
}

// ─────────────────────────────────────────────
//  HERO SLIDER
// ─────────────────────────────────────────────
const HeroSlider: React.FC<HeroSliderProps> = ({ slider }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const slides = slider?.slides || [];
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  // Switch to a specific slide, triggering the content transition
  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, current],
  );

  // Auto-advance through panels
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, slider?.autoplay_speed || 5000);
    return () => clearInterval(t);
  }, [slides.length, slider?.autoplay_speed]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden flex"
      style={{ height: 'clamp(340px, 60vh, 860px)' }}
    >
      {/* ── Background images — all stacked, active one on top ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img src={s.image_url} alt={s.title} className="w-full h-full object-cover block" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(6,5,4,0.80) 0%, rgba(6,5,4,0.42) 55%, rgba(6,5,4,0.08) 100%)',
            }}
          />
        </div>
      ))}

      {/* ── Left text content ── */}
      <div className="absolute inset-0 z-[5] flex items-center px-[6vw] pr-0">
        <div
          className="max-w-[500px] transition-all duration-500 ease-out"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(16px)' : 'translateY(0)',
          }}
        >
          {/* Tag */}
          <p
            className="text-[10px] font-normal uppercase tracking-[0.26em] mb-5"
            style={{ color: theme.accent }}
          >
            {slide.tag}
          </p>

          {/* Headline */}
          <h1
            className="font-semibold leading-[1.06] text-white mb-5 whitespace-pre-line"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm font-light tracking-[0.04em] mb-9"
            style={{ color: 'rgba(255,255,255,0.62)' }}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <a
            href={slide.cta_link || '#'}
            className="inline-block px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em]
                       border cursor-pointer no-underline
                       transition-all duration-300"
            style={{ 
              borderColor: `${theme.accent}aa`, 
              color: '#fff',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent;
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = `${theme.accent}aa`;
              e.currentTarget.style.color = '#fff';
            }}
          >
            {slide.cta_text} →
          </a>
        </div>
      </div>

      {/* ── Right panels — the slide mechanic ── */}
      <div className="absolute top-0 right-0 bottom-0 z-[6] flex flex-row items-stretch">
        {slides.map((s, i) => {
          const isActive = i === current;
          return (
            <div
              key={s.id}
              onClick={() => goTo(i)}
              className="relative flex flex-col items-center justify-between
                         py-9 cursor-pointer overflow-hidden
                         border-l border-white/[0.07]
                         transition-all duration-500 ease-in-out"
              style={{
                // Active panel is wide, inactive panels are narrow
                width: isActive ? 180 : 96,
                background: s.panel_bg || 'rgba(0,0,0,0.5)',
                backdropFilter: isActive ? 'blur(0px)' : 'blur(3px)',
              }}
            >
              {/* Background image peek on the active panel */}
              {isActive && (
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: 0.18 }}
                >
                  <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Top small label */}
              <span
                className="relative z-10 text-[9px] font-medium uppercase tracking-[0.22em]
                           transition-colors duration-300"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  color: isActive ? theme.accent : 'rgba(255,255,255,0.35)',
                }}
              >
                {s.panel_label}
              </span>

              {/* Main rotated title */}
              <span
                className="relative z-10 font-semibold tracking-[0.06em] whitespace-nowrap
                           transition-all duration-500"
                style={{
                  fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontSize: isActive ? 18 : 14,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  letterSpacing: isActive ? '0.08em' : '0.04em',
                }}
              >
                {s.panel_title}
              </span>

              {/* Bottom indicator — gold dash on active */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className="transition-all duration-500"
                  style={{
                    width: isActive ? 32 : 12,
                    height: isActive ? 2 : 1.5,
                    background: isActive ? theme.accent : 'rgba(255,255,255,0.25)',
                  }}
                />
                {/* Slide number on active */}
                {isActive && (
                  <span
                    className="text-[10px] tracking-[0.1em] opacity-50"
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      color: '#fff',
                      writingMode: 'horizontal-tb',
                    }}
                  >
                    0{i + 1}
                  </span>
                )}
              </div>

              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isActive
                    ? 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 60%)'
                    : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Dots (bottom left) ── */}
      {slider?.show_dots !== false && (
        <div className="absolute bottom-7 left-[6vw] z-10 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="h-[2px] rounded-sm border-none p-0 cursor-pointer transition-all duration-500"
              style={{
                width: i === current ? 28 : 7,
                background: i === current ? theme.accent : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Total counter ── */}
      <div
        className="absolute bottom-8 z-10 text-[11px] tracking-[0.12em]"
        style={{
          right: `calc(${slides.length * 96 + (180 - 96)}px + 28px)`,
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
};

export default HeroSlider;
