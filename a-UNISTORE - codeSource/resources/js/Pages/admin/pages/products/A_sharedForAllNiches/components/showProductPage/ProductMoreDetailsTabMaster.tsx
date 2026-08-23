import React from "react";
import { Package, Truck, Shield, Award } from "lucide-react";
import { ThemePalette } from "@/types/theme";

interface ProductDetailsProps {
  description: string;
  brand?: string;
  category?: Array<{ id: string; name: string }>;
  tags?: Array<{ id: string; name: string }>;
  sku?: string;
  releaseDate?: string;
  theme?: ThemePalette;
}

export const ProductMoreDetailsTabMaster: React.FC<ProductDetailsProps> = ({
  description, brand, category, tags, sku, releaseDate, theme,
}) => {
  const t = theme;

  const features = [
    { icon: <Package className="w-5 h-5" />, title: "Premium Quality", description: "Crafted with the finest materials for lasting durability" },
    { icon: <Truck className="w-5 h-5" />, title: "Fast Shipping", description: "Free shipping on orders over $50" },
    { icon: <Shield className="w-5 h-5" />, title: "Secure Payment", description: "Your payment information is always protected" },
    { icon: <Award className="w-5 h-5" />, title: "Warranty", description: "1-year warranty on all products" },
  ];

  const cardStyle = {
    background: t?.bgSecondary ?? "#fff",
    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
    borderRadius: t?.borderRadius ?? "16px",
  };

  return (
    <div className="space-y-8 p-6">
      {/* Description */}
      <div className="p-8" style={{ ...cardStyle, background: t?.card ?? "#f8fafc" }}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: t?.text }}>Product Description</h3>
        <p className="leading-relaxed text-lg" style={{ color: t?.textSecondary ?? t?.text }}>{description}</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={cardStyle}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-3 rounded-lg"
                style={{ background: t?.primary ?? "#0f172a", color: t?.textInverse ?? "#fff" }}
              >
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: t?.text }}>{feature.title}</h4>
                <p className="text-sm" style={{ color: t?.textMuted }}>{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="p-6 space-y-4" style={cardStyle}>
        <h3 className="text-xl font-bold mb-4" style={{ color: t?.text }}>Product Information</h3>
        {[
          brand ? { label: "Brand", value: brand } : null,
          category?.length ? { label: "Category", value: category.map(c => c.name).join(", ") } : null,
          sku ? { label: "SKU", value: sku } : null,
          releaseDate ? { label: "Release Date", value: releaseDate } : null,
        ].filter(Boolean).map(({ label, value }: any) => (
          <div
            key={label}
            className="flex justify-between py-3"
            style={{ borderBottom: `1px solid ${t?.border ?? "#e2e8f0"}` }}
          >
            <span className="font-medium" style={{ color: t?.textMuted }}>{label}</span>
            <span className="font-semibold" style={{ color: t?.text }}>{value}</span>
          </div>
        ))}

        {tags && tags.length > 0 && (
          <div className="pt-3">
            <span className="font-medium mb-3 block" style={{ color: t?.textMuted }}>Tags</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
                  style={{
                    background: t?.card ?? "#f1f5f9",
                    color: t?.text,
                    border: `1px solid ${t?.border ?? "#e2e8f0"}`,
                    borderRadius: 999,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMoreDetailsTabMaster;
