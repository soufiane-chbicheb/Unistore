import { useState, useRef, useCallback, useEffect } from "react";
import { Plus, Zap, AlertCircle, PackageSearch, MousePointerClick } from "lucide-react";
import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Variant } from "@/types/products/productVariantType";
import OptionSelector from "./OptionSelector";
import VariantCard from "./VariantCard";
import GenerateModal from "./GenerateModel";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { ProductSchemaType, variantSchema } from "@/shemas/productSchema";
import { useFieldArray } from "react-hook-form";
import { useToast } from "@/contextHooks/useToasts";
import { Button } from "@/components/ui/Button";

export default function VariantBuilder() {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const newCardRef = useRef<HTMLDivElement>(null);
  const { control, formState: { errors } } = useProductDataCtx();
  const { addToast } = useToast();
  const { fields: variants, append, remove, update } = useFieldArray<ProductSchemaType, 'variants'>({
    control,
    name: 'variants'
  });
  const { modeForm } = useProductDataCtx();
  const hasOpenCard = variants.some((v) => v.isOpen);
  const [defaultVariantsPrice, setDefaultVariantsPrice] = useState<number | undefined>();
  const variantStep2Ref = useRef<HTMLDivElement>(null);
  const [variantErrors, setVariantErrors] = useState<Record<string, any>>({});
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (modeForm === 'edit' && variants.length > 0 && !hasInitialized.current) {
      const attrs = variants[0]?.attrs;
      if (!attrs || typeof attrs !== 'object') return;
      const optionToBeSelected = Object.keys(attrs).map(el => el.toLowerCase());
      if (optionToBeSelected.length === 0) return;
      setActiveOptions(optionToBeSelected);
      hasInitialized.current = true;
    }
  }, [modeForm, variants.length]);

  const addEmpty = useCallback(() => {
    if (hasOpenCard) return;
    const newVariant: Variant = {
      variant_id: `v-${Date.now()}`,
      attrs: null,
      price: defaultVariantsPrice ?? 0,
      stock: 0,
      compare_price: 0,
      sku: null,
      images: [],
      isOpen: true,
    };
    append(newVariant);
    setTimeout(() => {
      newCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [hasOpenCard, append, defaultVariantsPrice]);

  const updateVariant = (id: string, field: string, value: any) => {

    const index = variants.findIndex(v => String(v.variant_id) == id);
    if (index === -1) return;

    const current = variants[index];
    
    if (field.startsWith("attrs.")) {
      const attrKey = field.replace("attrs.", "");
      update(index, { ...current, attrs: { ...(current.attrs ?? {}), [attrKey]: value } });
      return;
    }
    update(index, { ...current, [field]: value });
  };

  const removeVariant = (id: string) => {
    const index = variants.findIndex(f => f.variant_id === id);
    if (index === -1) return;
    remove(index);
    setVariantErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const markDone = (id: string) => {
    const index = variants.findIndex(v => v.variant_id === id);
    if (index === -1) return;

    const variant = variants[index];
    const result = variantSchema.safeParse(variant);
    if (!result.success) {
      setVariantErrors(prev => ({
        ...prev,
        [id]: result.error.flatten().fieldErrors
      }));
      return;
    }

    const isExists = checkIfExists(variant, variants as Variant[]);
    if (isExists) {
      addToast({
        title: "Duplicate",
        description: 'this variant exists',
        duration: 2000,
      });
      return;
    }

    setVariantErrors(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    update(index, { ...variant, isOpen: false });
    addToast({
      title: 'new variant added',
      type: 'success',
      duration: 1000
    });

    setTimeout(() => {
      variantStep2Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const checkIfExists = (variant: Variant, variants: Variant[]): boolean => {
    return variants.some(v => {
      if (v.variant_id === variant.variant_id) return false;

      const variantKeys  = Object.keys(variant.attrs  || {});
      const existingKeys = Object.keys(v.attrs || {});
      if (variantKeys.length !== existingKeys.length) return false;

      return variantKeys.every(key => {
        const a = variant.attrs?.[key];
        const b = v.attrs?.[key];

        if (typeof a === 'object' && a !== null && 'hex' in a) {
          return typeof b === 'object' && b !== null && 'hex' in b && a.hex === b.hex;
        }

        return a === b;
      });
    });
  };

  // FIX #4 — skip duplicates when appending generated variants
  const addGeneratedVariants = (generated: Variant[]) => {
    if (!generated?.length) return;
    const unique = generated.filter(g => !checkIfExists(g, variants as Variant[]));
    if (unique.length < generated.length) {
      addToast({
        title: 'Some duplicates were skipped',
        type: "info",
        duration: 2000
      });
    }
    if (unique.length === 0) return;
    append(unique);
    setTimeout(() => {
      newCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const handleColorImageUpload = (hex: string, url: string) => {
    if (!hex || !url) return; // FIX — defend against empty hex/url
    setColorImages((prev) => ({ ...prev, [hex]: url }));
  };

  const handleColorImageRemove = (hex: string) => {
    if (!hex) return; // FIX — defend against empty hex
    setColorImages((prev) => { const n = { ...prev }; delete n[hex]; return n; });
  };

  return (
    <div className="w-full" style={{ color: theme.text }}>

      {/* ── Step 1: Option Selector ── */}
      <OptionSelector
        selected={activeOptions}
        colorImages={colorImages}
        onChange={setActiveOptions}
        onColorImageUpload={handleColorImageUpload}
        onColorImageRemove={handleColorImageRemove}
        theme={theme}
      />

      {/* ── Step 2: Variants ── */}
      {(activeOptions.length > 0) && (
        <div ref={variantStep2Ref} className="mt-6">

          {/* Section header */}
          <div className="flex items-start justify-between p-3">
            <div className="">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: theme.textMuted }}
              >
                Step 2 — Variants
              </p>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {variants.length === 0
                  ? "Add your first variant below"
                  : `${variants.length} variant${variants.length !== 1 ? "s" : ""} · ${
                      variants.filter((v) => !v.stock).length > 0
                        ? `${variants.filter((v) => !v.stock).length} missing stock`
                        : "all good ✓"
                    }`
                }
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: theme.textMuted }}>
                  Default Price
                </label>
                <input
                  placeholder="0"
                  type="number"
                  // FIX #2 — dedaultVariantsPrice is undefined not null, ?? handles both
                  value={defaultVariantsPrice ?? ''}
                  onChange={(e) => setDefaultVariantsPrice(e.target.value === '' ? undefined : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl text-sm font-medium w-24"
                  style={{
                    background: theme.bg,
                    border: `2px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />
              </div>

              {/* Generate */}
              <Button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  border: `2px solid ${theme.primary}`,
                  background: 'transparent',
                  color: theme.primary,
                  cursor: "pointer",
                }}
              >
                <Zap size={14} />
                Generate
              </Button>

              {/* Add manually */}
              <Button
                type="button"
                onClick={addEmpty}
                disabled={hasOpenCard}
                title={hasOpenCard ? "Save the open variant first" : "Add a new variant"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  background: hasOpenCard ? theme.border : theme.primary,
                  border: "none",
                  color: hasOpenCard ? theme.textMuted : theme.textInverse,
                  cursor: hasOpenCard ? "not-allowed" : "pointer",
                }}
              >
                <Plus size={14} />
                Add manually
              </Button>
            </div>
          </div>

          {/* Warning banner */}
          {hasOpenCard && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{
                background: theme.warning + "15",
                border: `1px solid ${theme.warning}44`,
                color: theme.warning,
              }}
            >
              <AlertCircle size={14} />
              Save the open variant before adding another one.
            </div>
          )}

          {/* Empty state */}
          {variants.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-14 px-6 rounded-xl text-center"
              style={{
                border: `2px dashed ${theme.border}`,
                background: theme.bgSecondary,
              }}
            >
              <PackageSearch size={32} className="mb-3 opacity-30" style={{ color: theme.textMuted }} />
              <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>
                No variants yet
              </p>
              <p className="text-xs mb-5" style={{ color: theme.textMuted }}>
                Example: a Red T-shirt in size M with 10 units at 150 MAD
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={addEmpty}
                  className="px-5 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: theme.primary, border: "none", color: theme.textInverse, cursor: "pointer" }}
                >
                  <span className="flex items-center gap-2"><Plus size={14} /> Add first variant</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2 rounded-xl text-sm font-medium"
                  style={{ border: `2px solid ${theme.primary}`, background: 'transparent', color: theme.primary, cursor: "pointer" }}
                >
                  <span className="flex items-center gap-2"><Zap size={14} /> Generate</span>
                </Button>
              </div>
            </div>
          )}

          {/* Variant cards */}
          <div className="flex flex-col gap-3">
            {variants.map((v, i) => (
              <div key={v.variant_id} ref={i === variants.length - 1 ? newCardRef : undefined}>
                <VariantCard
                  variant={v}
                  onVariantImageUploaded={(hex, url) => handleColorImageUpload(hex, url)}
                  activeOptions={activeOptions}
                  defaultVariantsPrice={defaultVariantsPrice}
                  colorImages={colorImages}
                  onChange={updateVariant}
                  onRemove={removeVariant}
                  onDone={markDone}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── No options selected yet ── */}
      {activeOptions.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-14 px-6 rounded-xl text-center mt-5"
          style={{
            border: `2px dashed ${theme.border}`,
            background: theme.bgSecondary,
          }}
        >
          <MousePointerClick size={32} className="mb-3 opacity-30" style={{ color: theme.textMuted }} />
          <p className="text-sm font-semibold mb-1" style={{ color: theme.text }}>
            Select options first
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            For a t-shirt → select <strong>Color</strong> + <strong>Size</strong><br />
            For a phone → select <strong>Storage</strong> + <strong>Color</strong>
          </p>
        </div>
      )}

      {/* Generate modal */}
      {showModal && (
        <GenerateModal
          defaultVariantsPrice={defaultVariantsPrice}
          activeOptions={activeOptions}
          existingVariants={variants}
          onAdd={addGeneratedVariants}
          onClose={() => setShowModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
}

