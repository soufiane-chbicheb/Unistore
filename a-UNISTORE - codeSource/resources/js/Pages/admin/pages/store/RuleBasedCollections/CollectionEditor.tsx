import React, { useState, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Trash2, Sliders, GripVertical,
  PanelLeft, PanelRight, Maximize2, ChevronRight, ChevronLeft,
  RotateCcw, Save, AlertTriangle
} from 'lucide-react';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import CollectionEditorNav from './Partials/CollectionEditorNav';
import CollectionEditorInspector from './Partials/CollectionEditorInspector';
import { route } from 'ziggy-js';

// ─────────────────────────────────────────────
// UNSAVED CHANGES MODAL
// ─────────────────────────────────────────────

interface UnsavedModalProps {
  sectionName: string;
  onDiscard: () => void;
  onKeep: () => void;
}

function UnsavedModal({ sectionName, onDiscard, onKeep }: UnsavedModalProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onKeep} />
      <div
        className="relative z-10 w-[380px] rounded-2xl border p-6 shadow-2xl"
        style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary}20` }}
          >
            <AlertTriangle size={16} style={{ color: theme.primary }} />
          </div>
          <div>
            <p className="text-sm font-black mb-1.5" style={{ color: theme.text }}>
              You have unsaved changes
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: theme.text, opacity: 0.55 }}>
              Changes to{' '}
              <span className="font-bold" style={{ opacity: 1, color: theme.text }}>
                {sectionName}
              </span>{' '}
              will be lost if you switch without publishing first.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onKeep}
            className="flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: theme.primary, color: theme.textInverse }}
          >
            Keep Editing
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl border transition-all hover:opacity-60"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CENTER PANEL (PREVIEW)
// ─────────────────────────────────────────────

interface CenterPanelProps {
  activeSection: any;
  globalCardConfig: any;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onPublish: () => void;
  errors: any;
}

function CenterPanel({ activeSection, globalCardConfig, isDirty, isSaving, onReset, onPublish, errors }: CenterPanelProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  // Safety guard for empty states
  if (!activeSection) return null;

  return (
    <main className="flex-1 overflow-y-auto scrollbar-hide min-w-0" style={{ backgroundColor: theme.bg }}>
      <header
        className="sticky top-0 z-10 h-14 border-b flex items-center justify-between px-6"
        style={{ borderColor: theme.border, backgroundColor: theme.bg }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xs font-black uppercase tracking-widest" style={{ color: theme.textSecondary }}>
            {activeSection.name} Editor
          </h1>
          {isDirty && (
            <span
              className="px-2 py-0.5 text-[8px] font-black uppercase rounded-full"
              style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}
            >
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
          >
            <RotateCcw size={12} /> Reset to Factory
          </button>

          <button
            onClick={onPublish}
            disabled={!isDirty || isSaving}
            className={`flex items-center gap-2 px-6 py-1.5 text-[10px] font-black uppercase rounded transition-all duration-300 ${
              isDirty ? 'opacity-100 active:scale-95' : 'opacity-25 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: theme.primary,
              color: theme.textInverse,
              boxShadow: isDirty ? `0 0 0 3px ${theme.primary}30, 0 4px 14px ${theme.primary}40` : 'none',
            }}
          >
            <Save size={12} /> {isSaving ? 'Publishing...' : isDirty ? 'Publish Changes' : 'Saved'}
          </button>
        </div>
      </header>

      <div className="p-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-black italic">{activeSection.name}</h2>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Live Storefront Preview</p>
          </div>

          <div
            className="flex flex-nowrap w-full"
            style={{
              gap: `${activeSection.layout_config.gap}px`,
              paddingInline: `${activeSection.layout_config.paddingInline}px`,
            }}
          >
            {[...Array(activeSection.layout_config.displayLimit)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col min-w-0">
                <div
                  className="w-full relative overflow-hidden group border transition-all" // Fixed: Added overflow-hidden
                  style={{
                    aspectRatio: globalCardConfig.aspectRatio,
                    borderRadius: `${globalCardConfig.borderRadius}px`,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                >
                  <img
                    src={`https://picsum.photos/seed/p${activeSection.id}${i}/800/1000`}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      globalCardConfig.hoverEffect === 'zoom' ? 'group-hover:scale-110' : ''
                    }`}
                    alt=""
                  />
                  {globalCardConfig.hoverEffect === 'scrim' && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  {globalCardConfig.showBadge && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 text-[8px] font-black uppercase rounded shadow-sm"
                      style={{ backgroundColor: theme.primary, color: theme.textInverse }}
                    >
                      Hot
                    </div>
                  )}
                </div>
                <div className="mt-4" style={{ textAlign: globalCardConfig.textAlign }}>
                  <p className="text-xs font-bold uppercase tracking-tighter mb-1" style={{ color: theme.text }}>
                    Sample Product Name
                  </p>
                  {globalCardConfig.showPrice && (
                    <p className="text-sm font-black" style={{ color: theme.textSecondary }}>$149.00</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Validation Errors Display below preview */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-12 animate-in fade-in slide-in-from-top-4">
              <div 
                className="p-6 rounded-2xl border-l-4 shadow-xl"
                style={{ 
                  backgroundColor: theme.bg, 
                  borderColor: theme.error || '#ef4444',
                  borderTop: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-4" style={{ color: theme.error || '#ef4444' }}>
                  <AlertTriangle size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Publish Validation Errors</span>
                </div>
                <ul className="space-y-2">
                  {Object.entries(errors).map(([key, msg]: [string, any]) => (
                    <li key={key} className="text-xs font-bold flex items-baseline gap-3" style={{ color: theme.text }}>
                      <span style={{ color: theme.error || '#ef4444' }} className="text-lg">•</span>
                      <span>{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// MAIN EDITOR COMPONENT
// ─────────────────────────────────────────────

export default function CollectionEditor() {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const {
    collections = [],
    app_factory_config = [],
    selectedCollection,
    errors // Added errors from usePage props
  } = usePage().props as any;

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [sections, setSections] = useState<any[]>(collections);
  const [activeId, setActiveId] = useState<number>(selectedCollection?.id || collections[0]?.id);
  const [globalCardConfig, setGlobalCardConfig] = useState<any>(
    selectedCollection?.card_config || collections[0]?.card_config
  );

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [pendingSwitchId, setPendingSwitchId] = useState<number | null>(null);

  // Snapshot for dirty checking
  const [savedSnapshot, setSavedSnapshot] = useState({
    sections: collections,
    globalCardConfig: selectedCollection?.card_config || collections[0]?.card_config,
  });

  // Sync internal state when Inertia props refresh
  useEffect(() => {
    setSections(collections);
    if (selectedCollection) {
      setActiveId(selectedCollection.id);
      setGlobalCardConfig(selectedCollection.card_config);
      setSavedSnapshot({
        sections: collections,
        globalCardConfig: selectedCollection.card_config,
      });
    }
  }, [collections, selectedCollection]);

  const activeSection = useMemo(() => 
    sections.find((s) => s.id === activeId) ?? sections[0], 
  [sections, activeId]);

  const isDirty = useMemo(
    () => JSON.stringify({ sections, globalCardConfig }) !== JSON.stringify(savedSnapshot),
    [sections, globalCardConfig, savedSnapshot]
  );

  const updateSection = (updates: any) =>
    setSections((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...updates } : s)));

  const updateLayout = (updates: any) =>
    updateSection({ layout_config: { ...activeSection.layout_config, ...updates } });

  const updateGlobalCard = (updates: any) =>
    setGlobalCardConfig((prev: any) => ({ ...prev, ...updates }));

  const handleSelectSection = (id: number) => {
    if (id === activeId) return;
    if (isDirty) {
      setPendingSwitchId(id);
    } else {
      const section = sections.find(s => s.id === id);
      router.visit(route('collections.edit', { collection: section?.slug }));
    }
  };

  const handleDiscard = () => {
    if (pendingSwitchId !== null) {
      const target = sections.find(s => s.id === pendingSwitchId);
      setPendingSwitchId(null);
      router.visit(route('collections.edit', { collection: target?.slug }));
    }
  };

  const handlePublish = () => {
    if (!isDirty) return;

    const payload = {
      ...activeSection,
      card_config: globalCardConfig,
    };

    router.put(
      route('collections.update', { collection: activeSection.slug }),
      payload,
      {
        onBefore: () => setIsSaving(true),
        onSuccess: (page) => {
          const freshSections = page.props.collections as any[];
          const freshActiveConfig = freshSections.find(s => s.id === activeId)?.card_config;

          setSavedSnapshot({
            sections: freshSections,
            globalCardConfig: freshActiveConfig
          });
          setSections(freshSections);
          setGlobalCardConfig(freshActiveConfig);
          
          setShowToast({ show: true, message: 'Collection published successfully!', type: 'success' });
          setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
        },
        onError: (err) => {
          console.error('Publish errors:', err);
          setShowToast({ 
            show: true, 
            message: `Publish failed: ${Object.values(err)[0] || 'Unknown validation error'}`, 
            type: 'error' 
          });
          setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 5000);
        },
        onFinish: () => setIsSaving(false),
        preserveScroll: true,
      }
    );
  };

  const resetToFactory = () => {
    if (!activeSection) return;

   

    // Find factory config matching current collection key
    const factory = app_factory_config.find((f: any) => f.config_key === `collections.${activeSection.key}`);
    
    if (factory) {
      updateSection({
        layout_config: { ...factory.layout_config },
        rules: [...factory.rules],
        is_active: factory.is_active ?? true,
        name: factory.name,
      });
      setGlobalCardConfig({ ...factory.card_config });
      
      setShowToast({ show: true, message: 'Reset to factory defaults applied!', type: 'success' });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
    } else {
      const keys = app_factory_config.map((f: any) => f.config_key).join(', ');
      setShowToast({ 
        show: true, 
        message: `No factory match for "${activeSection.key}". Available: ${keys || 'none'}`, 
        type: 'error' 
      });
      setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 5000);
    }
  };


  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <CollectionEditorNav
        open={leftOpen}
        onToggle={() => setLeftOpen((v) => !v)}
        sections={sections}
        activeId={activeId}
        onSelect={handleSelectSection}
        dirtyId={isDirty ? activeId : null}
      />

      {!activeSection ? (
        <div className="flex-1 flex items-center justify-center" style={{ color: theme.textSecondary }}>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest">No collections found.</p>
          </div>
        </div>
      ) : (
        <>
          <CenterPanel
            activeSection={activeSection}
            globalCardConfig={globalCardConfig}
            isDirty={isDirty}
            onReset={resetToFactory}
            onPublish={handlePublish}
            isSaving={isSaving}
            errors={errors}
          />

          <CollectionEditorInspector
            open={rightOpen}
            onToggle={() => setRightOpen((v) => !v)}
            activeSection={activeSection}
            globalCardConfig={globalCardConfig}
            onUpdateSection={updateSection}
            onUpdateLayout={updateLayout}
            onUpdateGlobalCard={updateGlobalCard}
          />
        </>
      )}

      {pendingSwitchId !== null && (
        <UnsavedModal
          sectionName={activeSection?.name || "this collection"}
          onDiscard={handleDiscard}
          onKeep={() => setPendingSwitchId(null)}
        />
      )}

      {/* Custom Toast Feedback */}
      {showToast.show && (
        <div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ 
            backgroundColor: theme.bgSecondary, 
            borderColor: showToast.type === 'success' ? `${theme.primary}40` : `${theme.error || '#ef4444'}40`,
            color: theme.text
          }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: showToast.type === 'success' ? `${theme.primary}20` : `${theme.error || '#ef4444'}20` }}
          >
            {showToast.type === 'success' ? (
              <Save size={14} style={{ color: theme.primary }} />
            ) : (
              <AlertTriangle size={14} style={{ color: theme.error || '#ef4444' }} />
            )}
          </div>
          <span className="text-xs font-black uppercase tracking-wider">{showToast.message}</span>
        </div>
      )}

    </div>
  );
}

CollectionEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;

