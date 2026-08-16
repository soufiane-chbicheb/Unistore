import React from "react";
import { ThemePalette } from "@/types/theme";

interface Attribute {
  id: string | number;
  key?: string;
  name?: string;
  value?: string;
}

interface AttributeSelectorProps {
  label: string;
  attributes: Attribute[];
  theme?: ThemePalette;
  /* legacy selectable props — kept for size selector compatibility */
  selectedAttribute?: Attribute;
  onAttributeSelect?: (attribute: Attribute) => void;
  selectable?: boolean;
}

export const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  label,
  attributes,
  theme,
  selectedAttribute,
  onAttributeSelect,
  selectable = false,
}) => {
  return (
    <div className="space-y-3">
      <label
        className="text-sm font-semibold uppercase tracking-wide"
        style={{ color: theme?.text ?? "#0f172a" }}
      >
        {label}
        {selectable && selectedAttribute && (
          <>
            :{" "}
            <span style={{ color: theme?.accent ?? "#64748b" }}>
              {selectedAttribute.name}
            </span>
          </>
        )}
      </label>

      <div className="flex flex-wrap gap-2">
        {attributes.map((attr) => {
          /* badge mode — attrs from backend like { key: 'style', value: 'over' } */
          if (!selectable) {
            const displayKey = attr.key
              ? attr.key.charAt(0).toUpperCase() + attr.key.slice(1)
              : label;
            const displayVal = attr.value ?? attr.name ?? "";
            return (
              <span
                key={attr.id}
                className="px-3 py-1.5 text-xs font-semibold capitalize"
                style={{
                  borderRadius: theme?.borderRadius ?? "8px",
                  background: theme?.card ?? "#f1f5f9",
                  color: theme?.textMuted ?? "#64748b",
                  border: `1px solid ${theme?.border ?? "#e2e8f0"}`,
                }}
              >
                {displayKey}: {displayVal}
              </span>
            );
          }

          /* selectable mode — used for sizes */
          const isSelected = selectedAttribute?.id === attr.id;
          return (
            <button
              key={attr.id}
              onClick={() => onAttributeSelect?.(attr)}
              className="px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                borderRadius: theme?.borderRadius ?? "12px",
                background: isSelected
                  ? (theme?.primary ?? "#0f172a")
                  : (theme?.card ?? "#fff"),
                color: isSelected
                  ? (theme?.textInverse ?? "#fff")
                  : (theme?.text ?? "#0f172a"),
                border: `2px solid ${isSelected ? (theme?.primary ?? "#0f172a") : (theme?.border ?? "#cbd5e1")}`,
                boxShadow: isSelected ? (theme?.shadow ?? "0 2px 8px rgba(0,0,0,0.15)") : "none",
              }}
            >
              {attr.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeSelector;
