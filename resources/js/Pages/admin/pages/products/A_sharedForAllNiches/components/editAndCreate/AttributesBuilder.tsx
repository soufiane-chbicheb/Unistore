import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { Plus, Trash2, Tag, GripVertical, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ProductAttribute = {
  key: string;
  value: string;
};

// ─── Single Attribute Item ────────────────────────────────────────────────────
function AttributeItem({
  attribute,
  index,
  currentTheme,
  onChange,
  onRemove,
  isOpen,
  onToggle,
}: {
  attribute: ProductAttribute;
  index: number;
  currentTheme: any;
  onChange: (index: number, field: 'key' | 'value', value: string) => void;
  onRemove: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [focused, setFocused] = useState<'key' | 'value' | null>(null);
  const [localKey, setLocalKey] = useState(attribute.key);
  const [localValue, setLocalValue] = useState(attribute.value);

  const isDone = localKey && localValue;

  return (
    <div
      className="rounded-xl mb-3 group transition-all duration-200 overflow-hidden"
      style={{
        backgroundColor: currentTheme.bg,
        border: `1.5px solid ${isOpen ? currentTheme.badge : currentTheme.border}20`,
        boxShadow: currentTheme.shadow,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer"
        onClick={onToggle}
        style={{ backgroundColor: currentTheme.bgSecondary }}
      >
        <GripVertical size={14} className="opacity-30 cursor-grab" style={{ color: currentTheme.textMuted }} />
        <span className="text-xs font-bold uppercase tracking-widest flex-1" style={{ color: currentTheme.textMuted }}>
          {localKey ? `${localKey}${localValue ? `: ${localValue}` : ''}` : `Attribute #${index + 1}`}
        </span>
        {isDone && !isOpen && (
          <span style={{
            fontSize: 10,
            color: currentTheme.success,
            background: currentTheme.success + '15',
            border: `1px solid ${currentTheme.success}40`,
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 600,
          }}>✓ Done</span>
        )}
        <ChevronDown size={14} style={{
          color: currentTheme.textMuted,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }} />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-lg"
          style={{ color: currentTheme.error }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">

            {/* Key */}
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: currentTheme.textSecondary }}>
                Attribute
              </label>
              <Input
                type="text"
                value={localKey}
                placeholder="e.g. Material"
                onFocus={() => setFocused('key')}
                onBlur={() => { setFocused(null); onChange(index, 'key', localKey); }}
                onChange={(e) => setLocalKey(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: currentTheme.bgSecondary,
                  color: currentTheme.text,
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: focused === 'key' ? currentTheme.primary : currentTheme.border,
                  outline: 'none',
                }}
              />
            </div>

            {/* Value */}
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: currentTheme.textSecondary }}>
                Value
              </label>
              <Input
                type="text"
                value={localValue}
                placeholder="e.g. 100% Cotton"
                onFocus={() => setFocused('value')}
                onBlur={() => { setFocused(null); onChange(index, 'value', localValue); }}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: currentTheme.bgSecondary,
                  color: currentTheme.text,
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderColor: focused === 'value' ? currentTheme.primary : currentTheme.border,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                onChange(index, 'key', localKey);
                onChange(index, 'value', localValue);
                onToggle();
              }}
              disabled={!isDone}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: isDone ? currentTheme.primary : currentTheme.border,
                color: isDone ? currentTheme.textInverse : currentTheme.textMuted,
                cursor: isDone ? 'pointer' : 'not-allowed',
                border: 'none',
              }}
            >
              <Check size={12} />
              Save Attribute
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyAttributes({ currentTheme }: { currentTheme: any }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 rounded-xl "
      style={{ border: `2px dashed ${currentTheme.border}`, backgroundColor: currentTheme.bg }}
    >
      <Tag size={32} className="mb-3 opacity-30" style={{ color: currentTheme.textMuted }} />
      <p className="text-sm font-medium mb-1" style={{ color: currentTheme.textMuted }}>No attributes yet</p>
      <p className="text-xs opacity-60" style={{ color: currentTheme.textMuted }}>
        Add shared specs like Material, Weight, Origin...
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
function AttributesBuilder() {
  const { watch, setValue } = useProductDataCtx();
  const { state: { currentTheme } } = useAdminThemeCtx();

  const attributes: ProductAttribute[] = watch('product_attributes') || [];
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addAttribute = () => {
    setValue('product_attributes', [...attributes, { key: '', value: '' }]);
    setOpenIndexes(prev => [...prev, attributes.length]); // auto open new one
  };

  const removeAttribute = (index: number) => {
    setValue('product_attributes', attributes.filter((_, i) => i !== index));
    setOpenIndexes(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    setValue('product_attributes', attributes.map((attr, i) =>
      i === index ? { ...attr, [field]: value } : attr
    ));
  };

  return (
    <div className="p-5">
      {/* count badge */}
      {attributes.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: currentTheme.accent + '20', color: currentTheme.accent }}
          >
            {attributes.length} Attribute{attributes.length !== 1 ? 's' : ''}
          </span>
          <span className="text-xs" style={{ color: currentTheme.textMuted }}>
            Shared specs displayed on the product page
          </span>
        </div>
      )}

      {/* list or empty */}
      {attributes.length === 0 ? (
        <EmptyAttributes currentTheme={currentTheme} />
      ) : (
        attributes.map((attr, index) => (
          <AttributeItem
            key={index}
            attribute={attr}
            index={index}
            currentTheme={currentTheme}
            onChange={updateAttribute}
            onRemove={removeAttribute}
            isOpen={openIndexes.includes(index)}
            onToggle={() => toggleOpen(index)}
          />
        ))
      )}

      {/* Add button */}
      <Button
        type="button"
        onClick={addAttribute}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
        style={{
          backgroundColor: 'transparent',
          color: currentTheme.primary,
          border: `1.5px solid ${currentTheme.badge}`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = currentTheme.primary + '10'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
      >
        <Plus size={16} />
        Add Attribute
      </Button>
    </div>
  );
}

export default AttributesBuilder;

