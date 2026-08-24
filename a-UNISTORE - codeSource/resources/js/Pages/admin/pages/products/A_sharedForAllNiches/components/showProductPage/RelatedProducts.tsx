// RelatedProducts.tsx
import React from "react";
import { ThemePalette } from "@/types/theme";

interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  rating?: number;
}

interface RelatedProductsProps {
  products?: RelatedProduct[];
  theme?: ThemePalette;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products = [
    { id: "1", name: "Classic Oxford Shirt", price: "$79.99", image: "https://via.placeholder.com/200x250", rating: 4.3 },
    { id: "2", name: "Slim Fit Chinos", price: "$69.99", image: "https://via.placeholder.com/200x250", rating: 4.6 },
    { id: "3", name: "Casual Canvas Sneakers", price: "$89.99", image: "https://via.placeholder.com/200x250", rating: 4.5 },
    { id: "4", name: "Leather Belt", price: "$49.99", image: "https://via.placeholder.com/200x250", rating: 4.4 },
  ],
  theme,
}) => {
  const t = theme;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: t?.text }}>Complete Your Look</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <div
              className="relative overflow-hidden h-60 mb-3"
              style={{
                borderRadius: t?.borderRadius ?? "8px",
                background: t?.card ?? "#f1f5f9",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: t?.text }}>{product.name}</h3>
            <p className="text-sm font-bold mb-2" style={{ color: t?.text }}>{product.price}</p>
            {product.rating && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-xs ${s <= Math.round(product.rating!) ? "text-amber-400" : "text-gray-300"}`}>★</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
