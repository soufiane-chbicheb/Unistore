import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Banner, BannerSlot } from "@/types/bannerTypes";
import { RotateCcw, Save, Upload, Eye, EyeOff, Plus, X, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import BannerRenderer from "./BannerRenderer";

function AddBannerModal({
  availableBanners,
  onSelect,
  onClose,
}: {
  availableBanners: { key: string; name: string }[];
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 101,
        transform: 'translate(-50%, -50%)',
        width: 420, maxHeight: '70vh',
        background: theme.bg, borderRadius: 14,
        border: `1px solid ${theme.border}`,
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${theme.border}`,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.04em' }}>Add Banner</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>Choose a banner template to add</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: theme.textMuted,
              cursor: 'pointer', padding: 4, borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {availableBanners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: theme.textMuted, fontSize: 12 }}>
              No banner templates available
            </div>
          ) : (
            availableBanners.map(b => (
              <button
                key={b.key}
                onClick={() => { onSelect(b.key); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 10,
                  border: `0.5px solid ${theme.border}`,
                  background: theme.bgSecondary,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.primary;
                  (e.currentTarget as HTMLElement).style.background = `${theme.primary}10`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = theme.border;
                  (e.currentTarget as HTMLElement).style.background = theme.bgSecondary;
                }}
              >
                <div style={{
                  width: 36, height: 28, borderRadius: 6,
                  background: `${theme.primary}20`,
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <Plus size={14} style={{ color: theme.primary }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: 'monospace', marginTop: 2 }}>{b.key}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function SlotTab({
  slot,
  isActive,
  isLastVisible,
  onSelect,
  onToggleVisibility,
  theme,
}: {
  slot: BannerSlot;
  isActive: boolean;
  isLastVisible: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  theme: any;
}) {
  const is_visible = slot.is_visible;
  
  return (
    <div style={{
      display: 'flex',
      borderRadius: 20,
      overflow: 'hidden',
      border: `0.5px solid ${isActive ? theme.primary : is_visible ? theme.border : `${theme.border}50`}`,
      transition: 'border-color 0.15s',
      opacity: is_visible || isActive ? 1 : 0.6,
    }}>
      {/* Navigate button — primary action */}
      <button
        onClick={onSelect}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 12px', border: 'none',
          background: isActive ? theme.primary : theme.bg,
          color: isActive ? '#fff' : is_visible ? theme.text : theme.textMuted,
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {slot.slot_key}
      </button>

      {/* Divider */}
      <div style={{
        width: 1,
        background: isActive ? `${theme.primary}50` : theme.border,
        flexShrink: 0,
      }} />

      {/* Visibility toggle — secondary action */}
      <button
        onClick={(e) => { e.stopPropagation(); if (!isLastVisible) onToggleVisibility(); }}
        disabled={isLastVisible}
        title={
          isLastVisible
            ? 'At least one slot must be visible'
            : is_visible ? 'Hide slot' : 'Show slot'
        }
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '5px 9px', border: 'none',
          background: isActive ? `${theme.primary}cc` : theme.bgSecondary,
          color: isActive ? '#ffffffcc' : theme.textMuted,
          cursor: isLastVisible ? 'not-allowed' : 'pointer',
          opacity: isLastVisible ? 0.35 : 1,
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isLastVisible)
            (e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : theme.text;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = isActive ? '#ffffffcc' : theme.textMuted;
        }}
      >
        {is_visible ? <Eye size={10} /> : <EyeOff size={10} />}
      </button>
    </div>
  );
}

export default function BannerCenterPanel({
  activeBanner,
  activeSlotKey,
  activeElementKey,
  onSlotSelect,
  onElementSelect,
  onToggleSlotVisibility,
  isDirty,
  isSaving,
  onReset,
  onPublish,
  onUpdate,
  onAddBanner,
  availableBannerTemplates = [],
  errors = {},
}: {
  activeBanner: Banner | undefined;
  activeSlotKey: string;
  activeElementKey: string | null;
  onSlotSelect: (key: string) => void;
  onElementSelect: (slotKey: string, elementKey: string) => void;
  onToggleSlotVisibility: (slotKey: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onPublish: () => void;
  onUpdate: (path: string, value: any) => void;
  onAddBanner?: (key: string) => void;
  availableBannerTemplates?: { key: string; name: string }[];
  errors?: any;
}) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <main style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: theme.bgSecondary, minWidth: 0,
    }}>
      {/* Toolbar */}
      <header style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${theme.border}`, background: theme.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: theme.text,
          }}>
            {activeBanner?.name ?? 'Banner'} — Preview
          </span>
          {isDirty && (
            <span style={{
              padding: '2px 8px', fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', borderRadius: 20,
              backgroundColor: `${theme.primary}20`, color: theme.primary,
            }}>
              Unsaved
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Add Banner */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: theme.bgSecondary,
              border: `0.5px solid ${theme.border}`,
              borderRadius: 6, padding: '7px 14px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: theme.text, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.primary;
              (e.currentTarget as HTMLElement).style.color = theme.primary;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = theme.border;
              (e.currentTarget as HTMLElement).style.color = theme.text;
            }}
          >
            <Plus size={12} /> Add Banner
          </button>

          <button
            onClick={onReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: theme.textMuted, opacity: 0.6,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.6'}
          >
            <RotateCcw size={12} /> Reset to Factory
          </button>

          <button
            onClick={onPublish}
            disabled={!isDirty || isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: theme.text, color: theme.bg, border: 'none',
              padding: '8px 18px', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              cursor: isDirty && !isSaving ? 'pointer' : 'not-allowed',
              borderRadius: 6,
              opacity: isDirty ? 1 : 0.3, transition: 'opacity 0.2s',
              boxShadow: isDirty ? `0 0 0 3px ${theme.primary}30, 0 4px 14px ${theme.primary}30` : 'none',
            }}
          >
            <Save size={12} />
            {isSaving ? 'Publishing…' : 'Publish Changes'}
          </button>
        </div>
      </header>

      {/* Preview body */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeBanner && (
          <div style={{ maxWidth: 960, margin: '0 auto' }}>

            <BannerRenderer
              isEditor={true}
              banner={activeBanner}
              activeSlotKey={activeSlotKey}
              activeElementKey={activeElementKey}
              onSlotSelect={onSlotSelect}
              onElementSelect={onElementSelect}
              onUpdate={onUpdate}
            />

            {/* Compound slot tabs — navigate + visibility toggle */}
            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              {['left', 'middle', 'right'].map(slotKey => {
                const slot = activeBanner.slots.find(s => s.slot_key === slotKey);
                const is_visible = slot?.is_visible ?? false;
                const visibleCount = activeBanner.slots.filter(s => s.is_visible).length;
                const isLastVisible = is_visible && visibleCount === 1;

                return (
                  <SlotTab
                    key={slotKey}
                    slot={slot || { slot_key: slotKey, is_visible: false } as any}
                    isActive={slotKey === activeSlotKey}
                    isLastVisible={isLastVisible}
                    onSelect={() => {
                        if (slot && is_visible) {
                            onSlotSelect(slotKey);
                        } else {
                            onToggleSlotVisibility(slotKey);
                            onSlotSelect(slotKey);
                        }
                    }}
                    onToggleVisibility={() => onToggleSlotVisibility(slotKey)}
                    theme={theme}
                  />
                );
              })}

              {/* Hint */}
              <span style={{
                fontSize: 9, color: theme.textMuted, marginLeft: 4,
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                opacity: 0.5,
              }}>
                Click tab to select · Eye to toggle visibility
              </span>
            </div>

              {/* Meta strip */}
            <div style={{
              marginTop: 8, padding: '8px 14px',
              background: theme.bg, borderRadius: 8, border: `0.5px solid ${theme.border}`,
              display: 'flex', gap: 24,
            }}>
              {[
                { label: 'Key',       value: activeBanner.key },
                { label: 'Direction', value: activeBanner.direction.toUpperCase() },
                { label: 'Slots',     value: `${activeBanner.slots.filter(s => s.is_visible).length} visible` },
                { label: 'Ratio',     value: activeBanner.aspect_ratio },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: theme.text, marginLeft: 8 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Validation Errors Display bellow preview */}
            {Object.keys(errors).length > 0 && (
              <div style={{ marginTop: 24 }} className="animate-in fade-in slide-in-from-top-4">
                <div 
                  style={{ 
                    padding: '20px', 
                    borderRadius: '12px', 
                    borderLeft: `4px solid #ef4444`, 
                    backgroundColor: `${theme.bg}`,
                    border: `1px solid ${theme.border}`,
                    borderLeftWidth: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#ef4444' }}>
                    <AlertTriangle size={18} />
                    <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Publish Validation Errors
                    </span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
                    {Object.entries(errors).map(([key, msg]: [string, any]) => (
                      <li key={key} style={{ 
                        fontSize: 12, 
                        color: theme.text, 
                        fontWeight: 600, 
                        display: 'flex', 
                        alignItems: 'baseline',
                        gap: 8
                      }}>
                        <span style={{ color: '#ef4444', fontSize: 14 }}>•</span>
                        <span>{msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Banner Modal */}
      {showAddModal && (
        <AddBannerModal
          availableBanners={availableBannerTemplates}
          onSelect={(key) => onAddBanner?.(key)}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </main>
  );
}

