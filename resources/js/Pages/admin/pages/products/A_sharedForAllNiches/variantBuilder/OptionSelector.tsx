import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Button } from "@/components/ui/Button";

const AVAILABLE_OPTIONS = ["Color", "Size", "Storage", "RAM", "Style", "Width", "Connectivity", "Flavor"];

interface OptionSelectorProps {
  selected: string[];
  colorImages: Record<string, string>; // hex → imageUrl
  onChange: (options: string[]) => void;
  onColorImageUpload: (hex: string, url: string) => void;
  onColorImageRemove: (hex: string) => void;
  theme: ThemePalette;
}

const DB_COLORS = [
  { name: "Black",  hex: "#1a1a1a" },
  { name: "White",  hex: "#f0f0f0" },
  { name: "Red",    hex: "#e53e3e" },
  { name: "Blue",   hex: "#3182ce" },
  { name: "Green",  hex: "#38a169" },
  { name: "Yellow", hex: "#d69e2e" },
  { name: "Navy",   hex: "#2c3e7a" },
  { name: "Gray",   hex: "#718096" },
  { name: "Pink",   hex: "#ed64a6" },
  { name: "Beige",  hex: "#d4b896" },
];

export default function OptionSelector({ selected, colorImages, onChange, onColorImageUpload, onColorImageRemove, theme }: OptionSelectorProps) {
  const toggle = (opt: string) =>
    onChange(selectedLower.includes(opt.toLowerCase())
      ? selected.filter((o) => o.toLowerCase() !== opt.toLowerCase())
      : [...selected, opt] 
    );

  // Normalize selected to lowercase for all comparisons
  const selectedLower = selected.map((s) => s.toLowerCase());
  return (
    <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, padding: "20px 24px" }}>
      <p style={{ fontSize: 11, letterSpacing: "0.12em", color: theme.textMuted, marginBottom: 6 }}>STEP 1 — OPTIONS</p>
      <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
        What makes this product different? e.g. a t-shirt has <strong style={{ color: theme.textSecondary }}>Color</strong> + <strong style={{ color: theme.textSecondary }}>Size</strong>, a phone has <strong style={{ color: theme.textSecondary }}>Storage</strong> + <strong style={{ color: theme.textSecondary }}>Color</strong>
      </p>

      {/* Option toggle buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {AVAILABLE_OPTIONS.map((opt) => {
          const active = selectedLower.includes(opt.toLowerCase());
          return (
            <Button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: "7px 16px", borderRadius: theme.borderRadius, fontSize: 13, cursor: "pointer",
                border: `1px solid ${active ? theme.primary : theme.border}`,
                background: active ? theme.primary + "22" : "transparent",
                color: active ? theme.primary : theme.textSecondary,
                fontWeight: active ? 600 : 400, transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {active && <span style={{ fontSize: 10 }}>✓</span>}
              {opt}
            </Button>
          );
        })}

        <Button type="button" variant="outline">
          Manage Options
        </Button>
      </div>
    </div>
  );
}

function ColorImageSlot({ color, imageUrl, onUpload, onRemove, theme }: {
  color: { name: string; hex: string };
  imageUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  theme: ThemePalette;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 56 }}>
      {/* Color circle */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: color.hex,
          border: `2px solid ${theme.border}`,
          boxShadow: imageUrl ? `0 0 0 2px ${theme.bg}, 0 0 0 4px ${theme.success}` : "none",
        }} />
        {imageUrl && (
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, background: theme.success, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 8, color: "#fff" }}>✓</span>
          </div>
        )}
      </div>

      {/* Image thumbnail or upload trigger */}
      {imageUrl ? (
        <div style={{ position: "relative", width: 48, height: 48 }}>
          <img src={imageUrl} alt={color.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: `1px solid ${theme.border}` }} />
          <button
            type="button"
            onClick={onRemove}
            style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, background: theme.error, border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={8} color="#fff" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          style={{ width: 48, height: 48, borderRadius: 6, border: `2px dashed ${theme.border}`, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Upload size={14} color={theme.textMuted} />
        </div>
      )}

      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onUpload(URL.createObjectURL(f));
      }} />

      <span style={{ fontSize: 10, color: theme.textMuted, textAlign: "center" }}>{color.name}</span>
    </div>
  );
}
