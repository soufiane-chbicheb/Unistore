import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { Wand2 } from 'lucide-react';
import React from 'react';
import PricePreview from './PricePreview';
import { Input } from '@/components/ui/input';
import { FieldError, FieldErrors, useWatch } from 'react-hook-form';
import { keyof } from 'zod';
import { FormState } from 'react-hook-form';
import { ProductSchemaType } from '@/shemas/productSchema';



// ─── Main ─────────────────────────────────────────────────────────────────────
function SingleProductPricingSection() {
  const {  control ,  register , formState :{errors} } = useProductDataCtx();
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();
  const price = useWatch({ control, name: 'price' });
  const compare_price = useWatch({ control, name: 'compare_price' });
  const sku = useWatch({ control, name: 'sku' });

  const inputStyle = (errorKey?: keyof FieldErrors<ProductSchemaType> ) => ({
    backgroundColor: currentTheme.bg,
    color: currentTheme.text,
    borderWidth: '2px',
    borderColor:
      errorKey && errors[errorKey] ? '#ef4444' : currentTheme.border,
  });

  return (
    <div className="flex flex-col gap-6 p-3">

      {/* ── Row 1: Price | Compare Price | Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Price */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('price' , { valueAsNumber: true })}
            
            type="number"
            step="0.01"
            placeholder='Price'
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('price')}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-2">{errors.price.message as string}</p>
          )}
        </div>

        {/* Compare Price */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Compare at Price{' '}
            <span className="text-xs font-normal opacity-60">(optional)</span>
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder='Compare price'
            {...register('compare_price' , { valueAsNumber: true })}
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle()}
          />
        </div>

        {/* Price Preview */}
        <PricePreview
          price={Number(price)}
          comparePrice={Number(compare_price) ?? null}
          currentTheme={currentTheme}
        />
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: currentTheme.textMuted }}
        >
          Inventory
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: currentTheme.border }} />
      </div>

      {/* ── Row 2: Stock | SKU ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Stock */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide"
            style={{ color: currentTheme.text }}
          >
            Stock <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder='Stock'
            {...register('stock' , { valueAsNumber: true })}
           
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('stock')}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-2">{errors.stock.message as string}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label
            className="block text-sm font-bold mb-4 uppercase tracking-wide flex items-center gap-2"
            style={{ color: currentTheme.text }}
          >
            SKU
            {!sku && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full normal-case tracking-normal"
                style={{
                  backgroundColor: currentTheme.primary + '18',
                  color: currentTheme.primary,
                  border: `1px solid ${currentTheme.primary}40`,
                }}
              >
                <Wand2 size={10} />
                Auto
              </span>
            )}
          </label>
          <Input
            type="text"
            {...register('sku')}
           
            placeholder="Leave empty to auto-generate"
            className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
            style={inputStyle('sku')}
          />
          {errors.sku && (
            <p className="text-red-500 text-sm mt-2">{errors.sku.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleProductPricingSection;

