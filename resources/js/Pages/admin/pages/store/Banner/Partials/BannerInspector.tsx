import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Banner, BannerSlot } from "@/types/bannerTypes";
import {
  PanelRight, ChevronLeft, ChevronDown, Upload,
  Image, Type, MousePointerClick, AlignLeft, Sparkles, Eye, EyeOff,
  AlignCenter, AlignRight, Layout, Loader2
} from "lucide-react";
import React, { useRef } from "react";

interface BannerInspectorProps {
  open: boolean;
  onToggle: () => void;
  banner: Banner;
  activeSlotKey: string;
  activeElementKey: string | null;
  onElementSelect: (slotKey: string, elementKey: string) => void;
  onUpdate: (path: string, value: any) => void;
  onMediaChange: (slotIndex: number, file: File, isSecondary?: boolean) => void;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  return (
    <div style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: theme.textMuted, opacity: 0.6,
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '6px 10px', fontSize: 12,
        background: theme.bg, border: `0.5px solid ${theme.border}`,
        borderRadius: 6, color: theme.text, outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function RangeInput({
  value, onChange, min = 0, max = 48, unit = 'px',
}: {
  value: string; onChange: (v: string) => void; min?: number; max?: number; unit?: string;
}) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const numeric = parseInt(value) || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <input
        type="range"
        min={min} max={max}
        value={numeric}
        onChange={e => onChange(`${e.target.value}${unit}`)}
        style={{ flex: 1, accentColor: theme.primary, cursor: 'pointer' }}
      />
      <span style={{
        fontSize: 11, fontFamily: 'monospace', color: theme.text,
        minWidth: 36, textAlign: 'right',
      }}>
        {numeric}{unit}
      </span>
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: 28, height: 28, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 2 }}
      />
      <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{value}</span>
    </div>
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
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  return (
    <div style={{ display: 'flex', gap: 2, background: theme.bg, padding: 2, borderRadius: 6, border: `0.5px solid ${theme.border}` }}>
      {options.map(opt => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '6px 0', border: 'none', borderRadius: 4, cursor: 'pointer',
              background: isActive ? theme.primary : 'transparent',
              color: isActive ? '#fff' : theme.textMuted,
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function UploadBox({ label, onFile }: { label: string; onFile: (f: File) => void }) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref} type="file" accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }}
      />
      <div
        onClick={() => ref.current?.click()}
        style={{
          border: `0.5px dashed ${theme.border}`, borderRadius: 6, padding: '10px 12px',
          fontSize: 11, color: theme.textMuted, cursor: 'pointer', textAlign: 'center',
          background: theme.bg, marginBottom: 8,
        }}
      >
        <Upload size={13} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
        {label}
      </div>
    </>
  );
}

// ─── Accordion Block Row ──────────────────────────────────────────────────────
// Each content block is a row: [checkbox] [icon] [label] [chevron]
// When checked AND selected (activeElementKey matches), settings expand below.

function AccordionBlock({
  blockKey,
  label,
  icon: Icon,
  enabled,
  isOpen,
  onToggleEnabled,
  onSelect,
  children,
}: {
  blockKey: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  isOpen: boolean;
  onToggleEnabled: () => void;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const showSettings = enabled && isOpen;

  return (
    <div style={{
      marginBottom: 2,
      borderRadius: 8,
      border: `0.5px solid ${showSettings ? theme.primary + '50' : isOpen && !enabled ? theme.border : 'transparent'}`,
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* Row header */}
      <div
        onClick={() => { if (enabled) onSelect(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px',
          background: showSettings ? `${theme.primary}0d` : 'transparent',
          cursor: enabled ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          if (enabled && !showSettings)
            (e.currentTarget as HTMLElement).style.background = `${theme.primary}08`;
        }}
        onMouseLeave={(e) => {
          if (!showSettings)
            (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        {/* Existence checkbox */}
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => { e.stopPropagation(); onToggleEnabled(); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            accentColor: theme.primary,
            width: 13, height: 13,
            cursor: 'pointer', flexShrink: 0,
          }}
        />

        {/* Icon */}
        <Icon
          size={13}
          style={{
            color: enabled ? (showSettings ? theme.primary : theme.text) : theme.textMuted,
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
        />

        {/* Label */}
        <span style={{
          flex: 1,
          fontSize: 11, fontWeight: 700,
          color: enabled ? (showSettings ? theme.primary : theme.text) : theme.textMuted,
          transition: 'color 0.15s',
        }}>
          {label}
        </span>

        {/* Visibility indicator dot — when enabled but not selected */}
        {enabled && !isOpen && (
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: theme.primary, opacity: 0.5, flexShrink: 0,
          }} />
        )}

        {/* Chevron — when enabled */}
        {enabled && (
          <ChevronDown
            size={12}
            style={{
              color: theme.textMuted,
              transform: showSettings ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Settings panel — expands when this block is active */}
      {showSettings && (
        <div style={{
          padding: '4px 10px 12px 34px',
          borderTop: `0.5px solid ${theme.primary}20`,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Active Slot Panel ────────────────────────────────────────────────────────

function ActiveSlotPanel({
  slot,
  slotIndex,
  slotKey,
  allSlots,
  activeElementKey,
  onElementSelect,
  onUpdate,
  onMediaChange,
  onToggleSlotVisibility,
}: {
  slot: BannerSlot;
  slotIndex: number;
  slotKey: string;
  allSlots: BannerSlot[];
  activeElementKey: string | null;
  onElementSelect: (slotKey: string, elementKey: string) => void;
  onUpdate: (path: string, value: any) => void;
  onMediaChange: (slotIndex: number, file: File, isSecondary?: boolean) => void;
  onToggleSlotVisibility: (slotKey: string) => void;
}) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const base = `slots.${slotIndex}`;

  const select = (key: string) => onElementSelect(slotKey, key);

  // Content existence flags
  const hasMainImage    = !!slot.main_media;
  const hasOverlayImage = !!slot.secondary_media;
  const hasElements     = !!slot.elements;
  const eyebrowOn   = hasElements && !!slot.elements?.eyebrow;
  const titleOn     = hasElements && !!slot.elements?.title;
  const paragraphOn = hasElements && !!slot.elements?.paragraph;
  const buttonOn    = hasElements && !!slot.elements?.button;

  // Default element templates
  const DEFAULT_EYEBROW   = { text: 'NEW', color: '#ffd700', visible: true };
  const DEFAULT_TITLE     = { text: 'Title Here', color: '#ffffff', visible: true };
  const DEFAULT_PARAGRAPH = { text: 'Add your description here.', color: '#cccccc', visible: true };
  const DEFAULT_BUTTON    = { text: 'Shop Now', bg_color: '#ffffff', text_color: '#000000', visible: true };

  const toggleElement = (key: 'eyebrow' | 'title' | 'paragraph' | 'button', defaultVal: any) => {
    const currentElements: any = slot.elements ?? {};
    if (currentElements[key]) {
      const next = { ...currentElements };
      delete next[key];
      const hasAny = Object.keys(next).length > 0;
      onUpdate(`${base}.elements`, hasAny ? next : undefined);
    } else {
      onUpdate(`${base}.elements`, { ...currentElements, [key]: defaultVal });
    }
  };

  const toggleMainImage = () => {
    if (hasMainImage) {
      onUpdate(`${base}.main_media`, undefined);
    } else {
      onUpdate(`${base}.main_media`, { id: null, url: '', media_type: 'image' });
    }
  };

  const toggleOverlayImage = () => {
    if (hasOverlayImage) {
      onUpdate(`${base}.secondary_media`, undefined);
    } else {
      onUpdate(`${base}.secondary_media`, { id: null, url: '', media_type: 'image' });
    }
  };

  // Width distribution
  const ALL_WIDTHS = ['25', '35', '50', '65', '75'];
  const otherVisibleWidth = allSlots.reduce((sum, s, i) => {
    if (i === slotIndex || !s.is_visible) return sum;
    return sum + (parseInt(String(s.width)) || 0);
  }, 0);
  const maxAllowed = 100 - otherVisibleWidth;

  // Visibility
  const visibleCount  = allSlots.filter(s => s.is_visible).length;
  const isLastVisible = slot.is_visible && visibleCount === 1;

  return (
    <div>

      {/* ── Slot visibility toggle ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 8, marginBottom: 14,
        background: theme.bg, border: `0.5px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {slot.is_visible
            ? <Eye size={13} style={{ color: theme.primary }} />
            : <EyeOff size={13} style={{ color: theme.textMuted }} />
          }
          <span style={{ fontSize: 11, fontWeight: 700, color: slot.is_visible ? theme.text : theme.textMuted }}>
            {slot.is_visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <button
          disabled={isLastVisible}
          onClick={() => !isLastVisible && onToggleSlotVisibility(slotKey)}
          title={isLastVisible ? 'At least one slot must stay visible' : undefined}
          style={{
            fontSize: 10, fontWeight: 700, padding: '4px 10px',
            border: `0.5px solid ${slot.is_visible ? theme.border : theme.primary}`,
            borderRadius: 20, cursor: isLastVisible ? 'not-allowed' : 'pointer',
            background: slot.is_visible ? theme.bgSecondary : `${theme.primary}15`,
            color: slot.is_visible ? theme.textMuted : theme.primary,
            opacity: isLastVisible ? 0.4 : 1,
            transition: 'all 0.15s',
          }}
        >
          {slot.is_visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* ── Width ── */}
      {String(slot.width) !== '100' && (
        <Field label="Slot width">
          <div style={{ display: 'flex', gap: 4 }}>
            {ALL_WIDTHS.map(w => {
              const numW     = parseInt(w);
              const isOff    = numW > maxAllowed;
              const isActive = String(slot.width) === w;
              return (
                <button
                  key={w}
                  disabled={isOff}
                  onClick={() => !isOff && onUpdate(`${base}.width`, w)}
                  style={{
                    flex: 1, fontSize: 10, padding: '5px 0', border: 'none',
                    borderRadius: 4,
                    cursor: isOff ? 'not-allowed' : 'pointer',
                    background: isActive ? theme.primary : isOff ? theme.bgSecondary : theme.bg,
                    color: isActive ? '#fff' : isOff ? theme.textMuted : theme.text,
                    opacity: isOff ? 0.35 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {w}%
                </button>
              );
            })}
          </div>
        </Field>
      )}

      {/* ── Background color ── */}
      {slot.bg_color !== undefined && slot.bg_color !== null && (
        <Field label="Background color">
          <ColorInput
            value={slot.bg_color}
            onChange={v => onUpdate(`${base}.bg_color`, v)}
          />
        </Field>
      )}

      <hr style={{ opacity: 0.08, margin: '14px 0' }} />

      {/* ── Alignment (Positioning) ── */}
      <SectionLabel>Alignment & Positioning</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <Field label="Vertical Position">
          <AlignmentButtons 
            value={slot.elements?.settings?.vertical_position ?? 'center'}
            onChange={v => onUpdate(`${base}.elements.settings.vertical_position`, v)}
            options={[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ]}
          />
        </Field>
        <Field label="Horizontal Position">
          <AlignmentButtons 
            value={slot.elements?.settings?.horizontal_position ?? 'center'}
            onChange={v => onUpdate(`${base}.elements.settings.horizontal_position`, v)}
            options={[
              { label: <AlignLeft size={14} />, value: 'left' },
              { label: <AlignCenter size={14} />, value: 'center' },
              { label: <AlignRight size={14} />, value: 'right' },
            ]}
          />
        </Field>
      </div>

      <hr style={{ opacity: 0.08, margin: '14px 0' }} />

      {/* ── Content blocks — accordion ── */}
      <SectionLabel>Content blocks</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* Main Image */}
        <AccordionBlock
          blockKey="main_media"
          label="Main Image"
          icon={Image}
          enabled={hasMainImage}
          isOpen={activeElementKey === 'main_media'}
          onToggleEnabled={toggleMainImage}
          onSelect={() => select('main_media')}
        >
          <div style={{ marginTop: 8 }}>
            <UploadBox label="Upload main image" onFile={f => onMediaChange(slotIndex, f, false)} />
            {slot.main_media?.url && (
              <img
                src={slot.main_media.url} alt=""
                style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
          </div>
        </AccordionBlock>

        {/* Overlay Image */}
        <AccordionBlock
          blockKey="secondary_media"
          label="Overlay Image"
          icon={Image}
          enabled={hasOverlayImage}
          isOpen={activeElementKey === 'secondary_media'}
          onToggleEnabled={toggleOverlayImage}
          onSelect={() => select('secondary_media')}
        >
          <div style={{ marginTop: 8 }}>
            <UploadBox label="Upload overlay" onFile={f => onMediaChange(slotIndex, f, true)} />
            {slot.secondary_media?.url && (
              <img
                src={slot.secondary_media.url} alt=""
                style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
          </div>
        </AccordionBlock>

        {/* Eyebrow */}
        <AccordionBlock
          blockKey="eyebrow"
          label="Eyebrow"
          icon={Sparkles}
          enabled={eyebrowOn}
          isOpen={activeElementKey === 'eyebrow'}
          onToggleEnabled={() => toggleElement('eyebrow', DEFAULT_EYEBROW)}
          onSelect={() => select('eyebrow')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <Field label="Text">
              <TextInput
                value={slot.elements?.eyebrow?.text ?? ''}
                onChange={v => onUpdate(`${base}.elements.eyebrow.text`, v)}
              />
            </Field>
            <Field label="Color">
              <ColorInput
                value={slot.elements?.eyebrow?.color ?? '#ffd700'}
                onChange={v => onUpdate(`${base}.elements.eyebrow.color`, v)}
              />
            </Field>
            <Field label="Link">
              <TextInput
                value={slot.elements?.eyebrow?.link ?? ''}
                onChange={v => onUpdate(`${base}.elements.eyebrow.link`, v)}
              />
            </Field>
          </div>
        </AccordionBlock>

        {/* Title */}
        <AccordionBlock
          blockKey="title"
          label="Title"
          icon={Type}
          enabled={titleOn}
          isOpen={activeElementKey === 'title'}
          onToggleEnabled={() => toggleElement('title', DEFAULT_TITLE)}
          onSelect={() => select('title')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <Field label="Text">
              <TextInput
                value={slot.elements?.title?.text ?? ''}
                onChange={v => onUpdate(`${base}.elements.title.text`, v)}
              />
            </Field>
            <Field label="Color">
              <ColorInput
                value={slot.elements?.title?.color ?? '#ffffff'}
                onChange={v => onUpdate(`${base}.elements.title.color`, v)}
              />
            </Field>
            <Field label="Link">
              <TextInput
                value={slot.elements?.title?.link ?? ''}
                onChange={v => onUpdate(`${base}.elements.title.link`, v)}
              />
            </Field>
          </div>
        </AccordionBlock>

        {/* Paragraph */}
        <AccordionBlock
          blockKey="paragraph"
          label="Paragraph"
          icon={AlignLeft}
          enabled={paragraphOn}
          isOpen={activeElementKey === 'paragraph'}
          onToggleEnabled={() => toggleElement('paragraph', DEFAULT_PARAGRAPH)}
          onSelect={() => select('paragraph')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <Field label="Text">
              <TextInput
                value={slot.elements?.paragraph?.text ?? ''}
                onChange={v => onUpdate(`${base}.elements.paragraph.text`, v)}
              />
            </Field>
            <Field label="Color">
              <ColorInput
                value={slot.elements?.paragraph?.color ?? '#cccccc'}
                onChange={v => onUpdate(`${base}.elements.paragraph.color`, v)}
              />
            </Field>
            <Field label="Link">
              <TextInput
                value={slot.elements?.paragraph?.link ?? ''}
                onChange={v => onUpdate(`${base}.elements.paragraph.link`, v)}
              />
            </Field>
          </div>
        </AccordionBlock>

        {/* Button */}
        <AccordionBlock
          blockKey="button"
          label="Button"
          icon={MousePointerClick}
          enabled={buttonOn}
          isOpen={activeElementKey === 'button'}
          onToggleEnabled={() => toggleElement('button', DEFAULT_BUTTON)}
          onSelect={() => select('button')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <Field label="Label text">
              <TextInput
                value={slot.elements?.button?.text ?? ''}
                onChange={v => onUpdate(`${base}.elements.button.text`, v)}
              />
            </Field>
            <Field label="Link">
              <TextInput
                value={slot.elements?.button?.link ?? ''}
                onChange={v => onUpdate(`${base}.elements.button.link`, v)}
              />
            </Field>
            <div style={{ display: 'flex', gap: 16 }}>
              <Field label="BG color">
                <ColorInput
                  value={slot.elements?.button?.bg_color ?? '#000000'}
                  onChange={v => onUpdate(`${base}.elements.button.bg_color`, v)}
                />
              </Field>
              <Field label="Text color">
                <ColorInput
                  value={slot.elements?.button?.text_color ?? '#ffffff'}
                  onChange={v => onUpdate(`${base}.elements.button.text_color`, v)}
                />
              </Field>
            </div>
          </div>
        </AccordionBlock>

      </div>
    </div>
  );
}

// ─── Main Inspector ───────────────────────────────────────────────────────────

export default function BannerInspector({
  open,
  onToggle,
  banner,
  activeSlotKey,
  activeElementKey,
  onElementSelect,
  onUpdate,
  onMediaChange,
}: BannerInspectorProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  if (!banner) return null;

  const activeSlotIndex = banner.slots.findIndex(s => s.slot_key === activeSlotKey);
  const activeSlot      = banner.slots[activeSlotIndex];

  // Visibility for the "toggle slot" action in inspector
  const visibleCount = banner.slots.filter(s => s.is_visible).length;

  const handleToggleSlotVisibility = (slotKey: string) => {
    const slotIdx = banner.slots.findIndex(s => s.slot_key === slotKey);
    if (slotIdx < 0) return;
    // Redistribution happens in BannerEditor — we just call onUpdate for now
    // but this should ideally call the parent handler. We surface it via the
    // ActiveSlotPanel which calls onToggleSlotVisibility.
    // Since BannerEditor owns the redistribution logic, we fire a generic path update
    // to trigger isDirty. The redistribution is done by BannerEditor.
    onUpdate(`slots.${slotIdx}.is_visible`, !banner.slots[slotIdx].is_visible);
  };

  return (
    <aside style={{
      width: open ? 290 : 40, flexShrink: 0,
      borderLeft: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      transition: 'width 0.3s ease',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '0 12px', borderBottom: `1px solid ${theme.border}`, 
        background: theme.bgSecondary,
      }}>
        {open && (
          <div>
            <div style={{ 
              fontSize: 10, fontWeight: 800, 
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: theme.textSecondary 
            }}>
              Inspector
            </div>
            {activeSlot && (
              <div style={{ fontSize: 9, color: theme.primary, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {activeSlotKey} slot
                {activeElementKey && (
                  <span style={{ color: theme.textMuted, fontWeight: 500 }}>
                    {' '}· {activeElementKey}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: theme.textSecondary, cursor: 'pointer', padding: 4,
          }}
          className="hover:bg-black/5 rounded transition-all"
        >
          {open ? <PanelRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {open && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

          {/* ── Banner-level settings ── */}
          <SectionLabel>Banner</SectionLabel>

          <Field label="Direction">
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ltr', 'rtl'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => onUpdate('direction', d)}
                  style={{
                    flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 700,
                    border: 'none', borderRadius: 5, cursor: 'pointer',
                    background: banner.direction === d ? theme.primary : theme.bg,
                    color: banner.direction === d ? '#fff' : theme.text,
                    textTransform: 'uppercase',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Background color">
            <ColorInput value={banner.bg_color} onChange={v => onUpdate('bg_color', v)} />
          </Field>

          <Field label="Border radius">
            <RangeInput
              value={banner.border_radius}
              onChange={v => onUpdate('border_radius', v)}
              min={0} max={48} unit="px"
            />
          </Field>

          <hr style={{ opacity: 0.1, margin: '16px 0' }} />

          {/* ── Active slot config ── */}
          {activeSlot ? (
            <>
              <SectionLabel>{activeSlotKey} slot config</SectionLabel>
              <ActiveSlotPanel
                slot={activeSlot}
                slotIndex={activeSlotIndex}
                slotKey={activeSlotKey}
                allSlots={banner.slots}
                activeElementKey={activeElementKey}
                onElementSelect={onElementSelect}
                onUpdate={onUpdate}
                onMediaChange={onMediaChange}
                onToggleSlotVisibility={handleToggleSlotVisibility}
              />
            </>
          ) : (
            <div style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', marginTop: 24 }}>
              Click a slot in the preview to edit it
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

