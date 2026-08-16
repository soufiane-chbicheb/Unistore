import { useState } from "react";
import { X, Zap, Plus } from "lucide-react";
import { Variant } from "@/types/products/productVariantType";
import { ThemePalette } from "@/types/ThemeTypes";
import { useFieldArray } from "react-hook-form";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { ProductSchemaType } from "@/shemas/productSchema";

const DB_COLORS = [
  { name: "Black",  hex: "#1a1a1a" }, { name: "White",  hex: "#f0f0f0" },
  { name: "Red",    hex: "#e53e3e" }, { name: "Blue",   hex: "#3182ce" },
  { name: "Green",  hex: "#38a169" }, { name: "Yellow", hex: "#d69e2e" },
  { name: "Navy",   hex: "#2c3e7a" }, { name: "Gray",   hex: "#718096" },
  { name: "Pink",   hex: "#ed64a6" }, { name: "Beige",  hex: "#d4b896" },
];
const COLOR_HEX = Object.fromEntries(DB_COLORS.map((c) => [c.name, c.hex]));

const OPTION_SUGGESTIONS: Record<string, string[]> = {
  Size:         ["XS","S","M","L","XL","XXL"],
  Storage:      ["32GB","64GB","128GB","256GB","512GB"],
  RAM:          ["4GB","8GB","16GB","32GB"],
  Style:        ["Classic","Modern","Slim","Oversized"],
  Width:        ["Narrow","Regular","Wide"],
  Connectivity: ["WiFi","4G","5G"],
  Flavor:       ["Vanilla","Chocolate","Strawberry","Mint"],
};

function generateCombinations(optionValues: Record<string, string[]>): Array<Record<string, string>> {
  const keys = Object.keys(optionValues).filter((k) => (optionValues[k] || []).length > 0);
  if (!keys.length) return [];
  const combine = (arrays: string[][]): string[][] =>
    arrays.reduce<string[][]>((acc, arr) => acc.flatMap((a) => arr.map((b) => [...a, b])), [[]]);
  return combine(keys.map((k) => optionValues[k])).map((combo) =>
    Object.fromEntries(keys.map((k, i) => [k, combo[i]]))
  );
}

interface GenerateModalProps {
  activeOptions: string[];
  existingVariants: Variant[];
  onAdd: (variants: Variant[]) => void;
  onClose: () => void;
  theme: ThemePalette;
  defaultVariantsPrice? : number
}

export default function GenerateModal({
  activeOptions, existingVariants, defaultVariantsPrice, onAdd, onClose, theme
}: GenerateModalProps) {
  const [modalValues, setModalValues] = useState<Record<string, string[]>>(
    Object.fromEntries(activeOptions.map((o) => [o, []]))
  );
  const [generated, setGenerated] = useState<Array<Record<string, string>>>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { getValues, control } = useProductDataCtx();
  const { fields: variants, append, remove, update } = useFieldArray<ProductSchemaType, 'variants'>({
      control,
      name: 'variants'
  });

  const toggleValue = (opt: string, val: string) => {
    setModalValues((prev) => {
      const cur = prev[opt] || [];
      return { ...prev, [opt]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] };
    });
    setGenerated([]); setSelected(new Set());
  };

  const comboKey = (combo: Record<string, string>) => Object.values(combo).join(" / ");

  const alreadyAdded = (combo: Record<string, string>) =>
    existingVariants.some((v) => {
    const vKey = activeOptions.map((o) => {
        if (o.toLowerCase() === "color") {
          const c = v.attrs?.color as { name: string } | undefined;
          return c?.name ?? "";
        }
        return v.attrs?.[o.toLowerCase()] as string ?? "";
      }).join(" / ");
      return vKey === comboKey(combo);
    });

  const toggleSelect = (key: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const handleAdd = () => {
    const toAdd: Variant[] = generated
      .filter((c) => selected.has(comboKey(c)) && !alreadyAdded(c))
      .map((c, i) => {
        // ✅ build attrs: color goes in as { hex, name }, rest as strings
        const attrs: Record<string, any> = {};
        Object.entries(c).forEach(([k, v]) => {
          if (k.toLowerCase() === "color") {
            attrs.color = { hex: COLOR_HEX[v] || "#888", name: v };
          } else {
            attrs[k.toLowerCase()] = v;
          }
        });

        return {
          variant_id: `gen-${Date.now()}-${i}`,
          attrs,
          price: Number(defaultVariantsPrice ?? 0),
          compare_price: Number(defaultVariantsPrice ?? 0),
          stock: 0,
          sku: null,
          image : {
            id : null , 
            url : ''
          },
          isOpen: true,
        };
      });

    onAdd(toAdd);
    onClose();
  };

  const inputStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.border,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: theme.overlay, zIndex: 40 }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed", zIndex: 50,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "90%", maxWidth: 520,
          maxHeight: "80vh", overflowY: "auto",
          background: theme.modal,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.borderRadius,
          boxShadow: theme.shadowLg,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            borderBottom: `1px solid ${theme.border}`,
            position: "sticky", top: 0,
            background: theme.modal, zIndex: 1,
          }}
        >
          <div className="flex items-center gap-2">
            <Zap size={15} style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.text }}>
              Generate Variants
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: theme.textMuted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-xs mb-5" style={{ color: theme.textMuted }}>
            Select values for each option — combinations will be generated automatically. Then pick which ones you want.
          </p>

          {/* Option selectors */}
          {activeOptions.map((opt) => (
            <div key={opt} className="mb-5">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: theme.textMuted }}
              >
                {opt}
              </p>
              <div className="flex flex-wrap gap-2">
                {opt.toLowerCase() === "color"
                  ? DB_COLORS.map((c) => {
                      const active = (modalValues[opt] || []).includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => toggleValue(opt, c.name)}
                          title={c.name}
                          style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: c.hex, cursor: "pointer", flexShrink: 0,
                            border: active ? `3px solid ${theme.primary}` : `2px solid ${theme.border}`,
                            transition: "all 0.12s",
                          }}
                        />
                      );
                    })
                  : (OPTION_SUGGESTIONS[opt] || []).map((s) => {
                      const active = (modalValues[opt] || []).includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleValue(opt, s)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-100"
                          style={{
                            border: `1.5px solid ${active ? theme.primary : theme.border}`,
                            background: active ? theme.primary + "18" : "transparent",
                            color: active ? theme.primary : theme.textSecondary,
                            cursor: "pointer",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })
                }
              </div>
            </div>
          ))}

          {/* Generate button */}
          <button
            type="button"
            onClick={() => { setGenerated(generateCombinations(modalValues)); setSelected(new Set()); }}
            className="w-full py-3 rounded-xl text-sm font-semibold mb-5 flex items-center justify-center gap-2"
            style={{ background: theme.primary, border: "none", color: theme.textInverse, cursor: "pointer" }}
          >
            <Zap size={14} /> Generate Combinations
          </button>

          {/* Results */}
          {generated.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: theme.textMuted }}>
                  {generated.length} combinations
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(new Set(generated.filter((c) => !alreadyAdded(c)).map(comboKey)))}
                  className="text-xs font-semibold"
                  style={{ background: "none", border: "none", cursor: "pointer", color: theme.primary }}
                >
                  Select all available
                </button>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {generated.map((combo) => {
                  const key = comboKey(combo);
                  const added = alreadyAdded(combo);
                  const isSel = selected.has(key);
                  const colorEntry = combo["Color"]
                    ? DB_COLORS.find((c) => c.name === combo["Color"])
                    : null;

                  return (
                    <div
                      key={key}
                      onClick={() => !added && toggleSelect(key)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-100"
                      style={{
                        border: `1.5px solid ${isSel ? theme.primary : theme.border}`,
                        background: added ? theme.bgSecondary : isSel ? theme.primary + "10" : "transparent",
                        cursor: added ? "default" : "pointer",
                        opacity: added ? 0.5 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 16, height: 16, borderRadius: 4,
                          border: `1.5px solid ${isSel ? theme.primary : theme.border}`,
                          background: isSel ? theme.primary : "transparent",
                        }}
                      >
                        {isSel && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                      </div>

                      {/* Color dot */}
                      {colorEntry && (
                        <span
                          style={{
                            width: 12, height: 12, borderRadius: "50%", flexShrink: 0,
                            background: colorEntry.hex,
                            border: `1px solid ${theme.border}`,
                          }}
                        />
                      )}

                      <span className="flex-1 text-sm" style={{ color: added ? theme.textMuted : theme.text }}>
                        {key}
                      </span>

                      {added && (
                        <span className="text-xs" style={{ color: theme.textMuted }}>
                          already added
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {selected.size > 0 && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: theme.primary, border: "none", color: theme.textInverse, cursor: "pointer" }}
                >
                  <Plus size={14} /> Add selected ({selected.size})
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
