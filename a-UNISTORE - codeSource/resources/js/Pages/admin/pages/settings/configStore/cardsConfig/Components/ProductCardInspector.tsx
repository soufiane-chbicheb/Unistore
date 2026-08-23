import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { CardConfig } from "@/types/StoreConfigTypes";
import {
  Type, MousePointerClick, AlignLeft, Eye, EyeOff,
  AlignCenter, AlignRight, Layout, Image as ImageIcon,
} from "lucide-react";
import React from "react";

interface ProductCardInspectorProps {
  open: boolean;
  onToggle: () => void;
  config: CardConfig;
  onUpdate: (path: string, value: any) => void;
  selectedElement: string;
  onSelectElement: (el: string) => void;
}

// ─── Primitives ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: theme.primary,
      marginBottom: 16, marginTop: 8
    }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function SelectInput({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (v: string) => void; 
  options: { label: string; value: string }[] 
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', fontSize: 13,
        background: theme.bgSecondary, border: `1px solid ${theme.border}`,
        borderRadius: 8, color: theme.text, outline: 'none',
        boxSizing: 'border-box', cursor: 'pointer'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function AlignmentButtons({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: React.ReactNode; value: string }[];
}) {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ display: 'flex', gap: 4, background: theme.bgSecondary, padding: 4, borderRadius: 10, border: `1px solid ${theme.border}` }}>
      {options.map(opt => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px 0', border: 'none', borderRadius: 6, cursor: 'pointer',
              background: isActive ? theme.primary : 'transparent',
              color: isActive ? '#fff' : theme.textMuted,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const ProductCardInspector: React.FC<ProductCardInspectorProps> = ({
  open,
  config,
  onUpdate,
  selectedElement,
}) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();

  if (!config || !open) return null;

  const renderInspectorSettings = () => {
    switch (selectedElement) {
      case 'container':
        return (
          <>
            <SectionLabel>Container Shell</SectionLabel>
            <Field label="Internal Padding">
              <AlignmentButtons 
                value={config.internalPadding}
                onChange={v => onUpdate('internalPadding', v)}
                options={[
                  { label: 'Tight', value: 'tight' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Loose', value: 'loose' },
                ]}
              />
            </Field>
            <Field label="Border Corners">
              <SelectInput 
                value={config.borderCornerStyle}
                onChange={v => onUpdate('borderCornerStyle', v)}
                options={[
                  { label: 'Sharp', value: 'sharp' },
                  { label: 'Slightly Rounded', value: 'slightly-rounded' },
                  { label: 'Extra Rounded', value: 'extra-rounded' },
                ]}
              />
            </Field>
            <Field label="Shadow Depth">
              <AlignmentButtons 
                value={config.shadow}
                onChange={v => onUpdate('shadow', v)}
                options={[
                  { label: 'None', value: 'none' },
                  { label: 'Subtle', value: 'subtle' },
                  { label: 'Deep', value: 'deep' },
                ]}
              />
            </Field>
          </>
        );

      case 'image':
        return (
          <>
            <SectionLabel>Media Settings</SectionLabel>
            <Field label="Image Visibility">
               <AlignmentButtons 
                value={config.imageVisibility ? 'show' : 'hide'}
                onChange={v => onUpdate('imageVisibility', v === 'show')}
                options={[
                  { label: <Eye size={16} />, value: 'show' },
                  { label: <EyeOff size={16} />, value: 'hide' },
                ]}
              />
            </Field>
            <Field label="Aspect Ratio Box">
              <SelectInput 
                value={config.aspectRatio}
                onChange={v => onUpdate('aspectRatio', v)}
                options={[
                  { label: 'Square 1:1', value: '1:1' },
                  { label: 'Portrait 3:4', value: '3:4' },
                  { label: 'Landscape 4:3', value: '4:3' },
                ]}
              />
            </Field>
            <Field label="Fitting Mode">
              <AlignmentButtons 
                value={config.imageFitting}
                onChange={v => onUpdate('imageFitting', v)}
                options={[
                  { label: 'Crop (Fill)', value: 'cover' },
                  { label: 'Fit (Inside)', value: 'contain' },
                ]}
              />
            </Field>
          </>
        );

      case 'brand':
      case 'title':
      case 'price':
        return (
          <>
            <SectionLabel>{selectedElement.toUpperCase()} Typography</SectionLabel>
            <Field label="Font Size">
              <AlignmentButtons 
                value={config.titleScale}
                onChange={v => onUpdate('titleScale', v)}
                options={[
                  { label: 'Small', value: 'small' },
                  { label: 'Med', value: 'medium' },
                  { label: 'Large', value: 'large' },
                ]}
              />
            </Field>
            <Field label="Font Weight">
              <AlignmentButtons 
                value={config.titleWeight}
                onChange={v => onUpdate('titleWeight', v)}
                options={[
                  { label: 'Normal', value: 'normal' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Bold', value: 'bold' },
                ]}
              />
            </Field>
            <Field label="Letter Spacing">
               <AlignmentButtons 
                value="normal"
                onChange={() => {}}
                options={[
                  { label: 'Tight', value: 'tight' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Wide', value: 'wide' },
                ]}
               />
            </Field>
            {selectedElement === 'title' && (
              <Field label="Line-Clamp Truncation">
                <SelectInput 
                  value={String(config.titleLineLimit)}
                  onChange={v => onUpdate('titleLineLimit', parseInt(v))}
                  options={[
                    { label: 'Full Title', value: '0' },
                    { label: '1 Line', value: '1' },
                    { label: '2 Lines', value: '2' },
                  ]}
                />
              </Field>
            )}
          </>
        );

      case 'button':
        return (
          <>
            <SectionLabel>Action Button</SectionLabel>
            <Field label="Presence Settings">
              <SelectInput 
                value={config.buttonPresence}
                onChange={v => onUpdate('buttonPresence', v)}
                options={[
                  { label: 'Always Show', value: 'always' },
                  { label: 'Show on Hover', value: 'hover' },
                  { label: 'Hide', value: 'hide' },
                ]}
              />
            </Field>
            <Field label="Button Width">
              <AlignmentButtons 
                value={config.buttonWidth}
                onChange={v => onUpdate('buttonWidth', v)}
                options={[
                  { label: 'Full Width', value: 'full' },
                  { label: 'Auto Width', value: 'auto' },
                ]}
              />
            </Field>
            <Field label="Style Variant">
               <SelectInput 
                 value={config.buttonTheme || 'primary'}
                 onChange={v => onUpdate('buttonTheme', v)}
                 options={[
                   { label: 'Primary Theme', value: 'primary' },
                   { label: 'Secondary Theme', value: 'secondary' },
                   { label: 'Outline Minimal', value: 'outline' },
                 ]}
               />
            </Field>
          </>
        );

      default:
        return <div className="text-sm opacity-50 px-2 italic">Select an element to edit properties.</div>;
    }
  };

  return (
    <aside style={{
      width: 320, flexShrink: 0,
      borderLeft: `1px solid ${theme.border}`,
      background: theme.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        height: 64, flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '0 24px', borderBottom: `1px solid ${theme.border}`,
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5 }}>
            Editing Layer
          </div>
          <div style={{ fontSize: 14, color: theme.primary, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedElement === 'container' && <Layout size={18} />}
            {selectedElement === 'image' && <ImageIcon size={18} />}
            {['brand', 'title', 'price'].includes(selectedElement) && <Type size={18} />}
            {selectedElement === 'button' && <MousePointerClick size={18} />}
            <span style={{ textTransform: 'uppercase' }}>{selectedElement}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {renderInspectorSettings()}
      </div>
    </aside>
  );
};

export default ProductCardInspector;
