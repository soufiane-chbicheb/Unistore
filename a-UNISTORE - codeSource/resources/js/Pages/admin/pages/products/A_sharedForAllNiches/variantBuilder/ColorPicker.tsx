import { ThemePalette } from "@/types/ThemeTypes";
import { useState } from "react";

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

interface ColorPickerProps {
  value: string | null;
  colorName?: string | null;
  onChange: (hex: string, name: string) => void;
  theme: ThemePalette;
}

export default function ColorPicker({ value, colorName, onChange, theme }: ColorPickerProps) {
  const [customName, setCustomName] = useState(colorName || "");

  const isDbColor = DB_COLORS.find((c) => c.hex === value);
  const isCustom  = value && !isDbColor;

  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: "0.1em", color: theme.textMuted, marginBottom: 10 }}>COLOR</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>

        {/* DB colors */}
        {DB_COLORS.map((color) => {
          const sel = value === color.hex;
          return (
            <button
              type="button"
              key={color.hex}
              title={color.name}
              onClick={() => onChange(color.hex, color.name)}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: color.hex, cursor: "pointer",
                position: "relative", flexShrink: 0,
                border: sel ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
                boxShadow: sel ? `0 0 0 2px ${theme.bgSecondary}, 0 0 0 4px ${theme.primary}` : "none",
              }}
            >
              {sel && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  color: color.hex === "#f0f0f0" ? "#333" : "#fff",
                }}>✓</span>
              )}
            </button>
          );
        })}

        {/* Custom color — label wraps input, rainbow bg */}
        <label
          title="Pick custom color"
          style={{
            width: 30, height: 30, borderRadius: "50%",
            cursor: "pointer", flexShrink: 0,
            overflow: "hidden", display: "block",
            background: isCustom
              ? value!
              : "conic-gradient(red,yellow,lime,aqua,blue,magenta,red)",
            border: isCustom ? `3px solid ${theme.primary}` : `2px dashed ${theme.border}`,
            boxShadow: isCustom ? `0 0 0 2px ${theme.bgSecondary}, 0 0 0 4px ${theme.primary}` : "none",
          }}
        >
          <input
            type="color"
            value={isCustom ? value! : "#ffffff"}
            onChange={(e) => {
              setCustomName("");
              onChange(e.target.value, "Custom");
            }}
            style={{
              width: 40, height: 40, border: "none",
              padding: 0, cursor: "pointer",
              marginTop: -4, marginLeft: -4,
              opacity: 0,  // ← hide input, show label bg (rainbow or custom color)
            }}
          />
        </label>
      </div>

      {/* Custom name input */}
      {isCustom && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: value!,
            border: `2px solid ${theme.border}`,
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: theme.primary, marginBottom: 6 }}>
              Give this color a name — customers will see it on the product page
            </p>
            <input
              type="text"
              value={customName}
              placeholder="e.g. Ocean Blue..."
              onChange={(e) => {
                setCustomName(e.target.value);
                onChange(value!, e.target.value || "Custom");
              }}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 8,
                border: `2px solid ${!customName ? "#ef4444" : theme.border}`,
                background: theme.bg, color: theme.text,
                fontSize: 13, outline: "none",
              }}
            />
            {!customName && (
              <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Name is required</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
