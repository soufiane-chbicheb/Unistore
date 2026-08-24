import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Color } from "@/types/inventoryTypes";

interface Media { url: string; id: string | number; variant_id?: number; color_name?: string; }

interface MediaGalleryProps {
  media: (Media & { variant_id: number })[];
  video?: { url: string; id: string } | null;
  theme?: ThemePalette;
  selectedColor?: Color & { variant_id: number };
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, video, theme, selectedColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = theme;
  const allMedia = [...media];

  useEffect(() => {
    if (!selectedColor) return;
    
    console.log('Selected Color:', selectedColor);
    console.log('All Media:', allMedia);
    
    // 1. Try to find media that matches the EXACT variant_id of the selected color
    let idx = allMedia.findIndex(m => Number(m.variant_id) === Number(selectedColor.variant_id));
    
    // 2. If not found, try to find media that matches the color NAME 
    if (idx === -1 && selectedColor.name) {
      idx = allMedia.findIndex(m => m.color_name === selectedColor.name);
    }
    
    console.log('Found Index:', idx);
    
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  }, [selectedColor]);

  const goTo = (i: number) => setCurrentIndex(i);
  const prev = () => setCurrentIndex(p => p === 0 ? allMedia.length - 1 : p - 1);
  const next = () => setCurrentIndex(p => p === allMedia.length - 1 ? 0 : p + 1);

  return (
    <div className="flex gap-2" style={{ height: 420 }}>

      {/* THUMBNAIL STRIP */}
      {allMedia.length > 1 && (
        <div
          className="flex flex-col gap-1.5 overflow-y-auto flex-shrink-0"
          style={{
            width: 60,
            scrollbarWidth: "none",
          }}
        >
          {allMedia.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                border: `2px solid ${i === currentIndex ? (t?.primary ?? "#0f172a") : "transparent"}`,
                opacity: i === currentIndex ? 1 : 0.55,
                transform: i === currentIndex ? "scale(1.04)" : "scale(1)",
                background: t?.card ?? "#f1f5f9",
                overflow: "hidden",
              }}
            >
              <img
                src={item.url}
                alt={String(item.id)}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </button>
          ))}
        </div>
      )}

      {/* MAIN IMAGE */}
      <div
        className="relative flex-1 overflow-hidden group"
        style={{
          borderRadius: 16,
          background: t?.card ?? "#f8fafc",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {allMedia[currentIndex] && (
          <img
            key={currentIndex}
            src={allMedia[currentIndex].url}
            alt={String(allMedia[currentIndex].id)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ animation: "imgFadeIn 0.35s ease" }}
          />
        )}

        {/* subtle gradient bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)" }} />

        {/* nav arrows */}
        {allMedia.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(255,255,255,0.92)", color: t?.text }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(255,255,255,0.92)", color: t?.text }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* dot indicators */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {allMedia.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentIndex ? 20 : 5,
                  height: 5,
                  background: i === currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
                }} />
            ))}
          </div>
        )}

        {/* counter badge */}
        <div className="absolute top-2.5 right-2.5 text-white text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(4px)" }}>
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>

      <style>{`
        @keyframes imgFadeIn {
          from { opacity: 0.5; transform: scale(1.03); }
          to   { opacity: 1;   transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MediaGallery;
