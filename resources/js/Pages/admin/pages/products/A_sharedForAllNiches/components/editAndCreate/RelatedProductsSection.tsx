import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { Search, X, Link2, PackageSearch, TrashIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import EmptyListSection from '@/admin/components/partials/EmptyListSection';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { DEFAULT_PRODUCT_IMAGE } from '@/data/defaults';

type SearchProduct = {
  id: number;
  name: string;
  slug: string;
  thumbnail: { url: string } | null;
};

// ─── Selected Product Chip ────────────────────────────────────────────────────
function SelectedProduct({ product, onRemove, currentTheme }: {
  product: SearchProduct;
  onRemove: (id: number) => void;
  currentTheme: any;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg group"
      style={{ backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.border}` }}>
      {product.thumbnail?.url ? (
        <img src={product.thumbnail.url} alt={product.name} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: currentTheme.bgSecondary }}>
          {
              DEFAULT_PRODUCT_IMAGE ?
              <img
                src={DEFAULT_PRODUCT_IMAGE}
                alt={product.name}
                className="w-9 h-9 rounded-md object-cover flex-shrink-0"
              />
              :
              <PackageSearch size={14} style={{ color: currentTheme.textSecondary }} />
           }
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate leading-tight" style={{ color: currentTheme.text }}>{product.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Link2 size={10} style={{ color: currentTheme.textMuted }} />
          <p className="text-xs truncate" style={{ color: currentTheme.textMuted }}>{product.slug}</p>
        </div>
      </div>
      <button type="button" onClick={() => onRemove(product.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md flex-shrink-0"
        style={{ color: currentTheme.error }}>
        <TrashIcon size={13} />
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function RelatedProductsSection() {
  const { watch, setValue , getValues } = useProductDataCtx();
  const { state: { currentTheme } } = useAdminThemeCtx();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const relatedIds: number[] = watch('related_products') ?? [];
  const [selectedProducts, setSelectedProducts] = useState<SearchProduct[]>([]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(route('products.suggest'), {
          params: { q: query.toLowerCase(), exclude: [getValues('id'), ...relatedIds] },
        });
        console.log(res)
        setResults(res.data);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addProduct = (product: SearchProduct) => {
    if (relatedIds.includes(product.id)) return;
    setValue('related_products', [...relatedIds, product.id], { shouldValidate: true });
    setSelectedProducts(prev => [...prev, product]);
    setQuery('');
    setShowDropdown(false);
  };

  const removeProduct = (id: number) => {
    setValue('related_products', relatedIds.filter(rid => rid !== id), { shouldValidate: true });
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-5 space-y-4">

      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Search products by name..."
        >
          <Search size={15} className={loading ? 'animate-pulse' : ''} />
        </Input>

        {/* Dropdown */}
        {showDropdown && results.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
            style={{
              backgroundColor: currentTheme.bg,
              border: `1px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadowMd,
            }}
          >
            <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5 p-1 themed-scroll">
              {results.map((product) => {
                const isSelected = relatedIds.includes(product.id);
                return (
                  <Button
                    key={product.id}
                    type="button"
                    disabled={isSelected}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      opacity: isSelected ? 0.5 : 1,
                      cursor: isSelected ? 'default' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = `${currentTheme.accent}15`; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {/* Thumbnail */}
                    {product.thumbnail?.url ? (
                      <img
                        src={product.thumbnail.url}
                        alt={product.name}
                        className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.bgSecondary }}
                      > 
                      {
                        DEFAULT_PRODUCT_IMAGE ?
                      
                        <img
                          src={DEFAULT_PRODUCT_IMAGE}
                          alt={product.name}
                          className="w-9 h-9 rounded-md object-cover flex-shrink-0"
                        />
                        :
                        <PackageSearch size={14} style={{ color: currentTheme.textSecondary }} />
                      }
                      </div>
                    )}

                    {/* Name + slug */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: currentTheme.text }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Link2 size={10} style={{ color: currentTheme.textSecondary }} />
                        <p className="text-xs truncate" style={{ color: currentTheme.textSecondary }}>
                          {product.slug}
                        </p>
                      </div>
                    </div>

                    {/* Added badge */}
                    {isSelected && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${currentTheme.accent}18`, color: currentTheme.accent }}
                      >
                        Added
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* No results */}
        {showDropdown && !loading && results.length === 0 && query.length >= 2 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl px-4 py-3 z-50"
            style={{ backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.border}` }}
          >
            <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
              No products found for "{query}"
            </p>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedProducts.length > 0 && (
        <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
          {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
        </p>
      )}

      {/* Selected list */}
      {selectedProducts.length === 0 ? (
        <EmptyListSection Icon={PackageSearch} description='No related products selected' />
      ) : (
        <div className="space-y-2">
          {selectedProducts.map((product) => (
            <SelectedProduct key={product.id} product={product} onRemove={removeProduct} currentTheme={currentTheme} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RelatedProductsSection;

