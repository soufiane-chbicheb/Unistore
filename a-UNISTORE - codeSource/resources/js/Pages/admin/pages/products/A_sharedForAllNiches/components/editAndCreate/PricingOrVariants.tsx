import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import React from 'react';
import SwitchToggler from '@/components/ui/SwitchToggler';
import SingleProductPricingSection from './SingleProductPricingSection';
import VariantBuilder from '../../variantBuilder/VariantBuilder';

function PricingOrVariants() {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  const { watch, setValue } = useProductDataCtx();

  const variants = watch('variants') || [];

  const [variantsEnabled, setVariantsEnabled] = React.useState(variants.length > 0);

  const toggle = (val: boolean) => {
    if (!val && variants.length > 0) {
      const confirmed = window.confirm(
        `You have ${variants.length} variant${variants.length !== 1 ? 's' : ''} that will be permanently deleted. Are you sure?`
      );
      if (!confirmed) return;
      setValue('variants', [], { shouldValidate: true });
    }
    setVariantsEnabled(val);
  };
  return (
    <div className="p-0">

      {/* ── Toggle row ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: currentTheme.bg,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: currentTheme.text }}>
            This product has variants
          </p>
          <p className="text-xs mt-0.5" style={{ color: currentTheme.textMuted }}>
            {variantsEnabled
              ? 'Price & stock managed per variant'
              : 'Single price, stock and SKU'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border"
            style={{
              backgroundColor: variantsEnabled ? currentTheme.primary + '12' : currentTheme.bgSecondary,
              color: variantsEnabled ? currentTheme.primary : currentTheme.textMuted,
              borderColor: variantsEnabled ? currentTheme.primary : currentTheme.border,
            }}
          >
            {variantsEnabled ? '✦ Has Variants' : 'Single Product'}
          </span>

          <SwitchToggler
            checked={variantsEnabled}
            onChange={toggle}
            id="switch-has-variants"
          />
        </div>
      </div>

      {/* ── Content swap ── */}
      {!variantsEnabled
        ? <SingleProductPricingSection  />
        : <VariantBuilder />
      }
    </div>
  );
}

export default PricingOrVariants;

