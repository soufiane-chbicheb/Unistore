import React from "react";
import { Check } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Color } from "@/types/inventoryTypes";

interface ColorSelectorProps {
  colors: (Color & { variant_id: number })[];
  selectedColor?: Color & { variant_id: number };
  onColorSelect: (color: Color & { variant_id: number }) => void;
  theme?: ThemePalette;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors, selectedColor, onColorSelect, theme,
}) => {
  const t = theme;

  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.12em", marginBottom: 12, color: t?.textMuted,
      }}>
        Color:{" "}
        <span style={{ textTransform: "none", letterSpacing: "normal", color: t?.text }}>
          {selectedColor?.name}
        </span>
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {colors.map((color) => {
          const isSelected = String(selectedColor?.hex) === String(color.hex);

          /* compute check color from luminance */
          const hex = (color.hex ?? "#000000").replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16) || 0;
          const g = parseInt(hex.substring(2, 4), 16) || 0;
          const b = parseInt(hex.substring(4, 6), 16) || 0;
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const checkColor = lum > 0.55 ? "#000" : "#fff";

          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color)}
              title={color.name ?? undefined}
              style={{
                position: "relative",
                width: 34, height: 34, borderRadius: "50%",
                backgroundColor: color.hex ?? t?.border ?? "#ccc",
                border: "none", outline: "none", padding: 0,
                cursor: "pointer", flexShrink: 0,
                transition: "transform 0.15s, box-shadow 0.15s",
                ...(isSelected
                  ? {
                    boxShadow: `0 0 0 3px ${t?.bg ?? "#fff"}, 0 0 0 5px ${t?.primary ?? "#0f172a"}`,
                    transform: "scale(1.15)",
                  }
                  : { boxShadow: "none", transform: "scale(1)" }),
              }}
            >
              {isSelected && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check strokeWidth={3.5} style={{ width: 14, height: 14, color: checkColor }} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
