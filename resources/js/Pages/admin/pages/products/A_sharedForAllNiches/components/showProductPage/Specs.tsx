// Specs.tsx
import React from "react";
import { Package, Shield } from "lucide-react";
import { ThemePalette } from "@/types/theme";

interface SpecsProps {
  materials?: Array<{ id: string; name: string }>;
  madeCountry?: { code: string; name: string };
  fits?: Array<{ id: string; name: string }>;
  season?: string[];
  gender?: string[];
  styles?: string[];
  sku?: string;
  theme?: ThemePalette;
}

const careInstructions = [
  "Machine wash cold with like colors",
  "Do not bleach",
  "Tumble dry low",
  "Iron on low heat if needed",
  "Do not dry clean",
];

export const Specs = ({ materials, madeCountry, fits, season, gender, styles, sku, theme }: SpecsProps) => {
  const t = theme;
  const cardStyle = {
    background: t?.bgSecondary ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    borderRadius: t?.borderRadius ?? "16px",
    color: t?.text,
  };

  const rows = [
    { label: "SKU", value: sku },
    materials?.length ? { label: "Materials", value: materials.map(m => m.name).join(", ") } : null,
    fits?.length ? { label: "Fit", value: fits.map(f => f.name).join(", ") } : null,
    season?.length ? { label: "Season", value: season.join(", ") } : null,
    styles?.length ? { label: "Style", value: styles.join(", ") } : null,
    gender?.length ? { label: "Gender", value: gender.join(", ") } : null,
    madeCountry ? { label: "Made In", value: madeCountry.name } : null,
  ].filter(Boolean) as { label: string; value: string | undefined }[];

  return (
    <div className="space-y-8 p-6">
      {/* Specs table */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{ color: t?.text }}>Technical Specifications</h3>
        <div className="grid gap-0">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex py-3" style={{ borderBottom: `1px solid ${t?.border ?? "#e2e8f0"}` }}>
              <span className="font-semibold w-40" style={{ color: t?.text }}>{label}</span>
              <span style={{ color: t?.textSecondary ?? t?.text }}>{value ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Care Instructions */}
      <div className="p-8" style={cardStyle}>
        <h3 className="text-xl font-bold mb-4" style={{ color: t?.text }}>Care Instructions</h3>
        <ul className="space-y-3">
          {careInstructions.map((instruction, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: t?.primary ?? "#0f172a", color: t?.textInverse ?? "#fff" }}
              >
                {i + 1}
              </div>
              <span className="leading-relaxed" style={{ color: t?.text }}>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warranty & Returns */}
      <div className="p-8" style={{ ...cardStyle, background: t?.primary ?? "#0f172a", color: t?.textInverse ?? "#fff", border: "none" }}>
        <h3 className="text-xl font-bold mb-6">Warranty & Returns</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: t?.success ?? "#34d399" }} />
            <div>
              <h4 className="font-semibold mb-1">1-Year Warranty</h4>
              <p className="text-sm opacity-75">All products come with a comprehensive 1-year warranty covering manufacturing defects.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: t?.info ?? "#60a5fa" }} />
            <div>
              <h4 className="font-semibold mb-1">30-Day Returns</h4>
              <p className="text-sm opacity-75">Not satisfied? Return within 30 days for a full refund, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specs;
