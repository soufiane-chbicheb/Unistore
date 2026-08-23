import React, { useState, useRef, useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { route } from 'ziggy-js';
import { Banner } from '@/types/bannerTypes';
import axios from 'axios';
import { productFilesUploaderCleaner } from '@/functions/product/productFilesUploaderCleaner';
import BannerNav from './Partials/BannerNav';
import BannerCenterPanel from './Partials/BannerPreview';
import BannerInspector from './Partials/BannerInspector';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useToast } from '@/contextHooks/useToasts';


export default function BannerEditor() {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const { 
    banners = [], 
    app_factory_config = [], 
    selectedBanner, 
    available_banner_templates = [],
    errors = {} // Added errors
  } = usePage().props as any;

  const initialData = useMemo(() => {
    return banners.length > 0 ? banners : [];
  }, [banners]);

  const [localBanners, setLocalBanners]     = useState<Banner[]>(initialData);
  const [activeId, setActiveId]             = useState<number>(selectedBanner?.id ?? initialData[0]?.id);
  const [activeSlotKey, setActiveSlotKey]   = useState<string>(initialData[0]?.slots[0]?.slot_key ?? 'left');
  const [activeElementKey, setActiveElementKey] = useState<string | null>(null);
  const [isSaving, setIsSaving]             = useState(false);
  const [savedSnapshot, setSavedSnapshot]   = useState<string>(JSON.stringify(initialData));
  const [leftOpen, setLeftOpen]             = useState(true);
  const [rightOpen, setRightOpen]           = useState(true);
  const [uploadingMedia, setUploadingMedia] = useState<Record<string, boolean>>({});
  const { uploadProductFiles }              = productFilesUploaderCleaner();
  const { addToast }                        = useToast();

  // Sync when Inertia refreshes props after a server round-trip
  useEffect(() => {
    setLocalBanners(banners);
    if (selectedBanner) {
      setActiveId(selectedBanner.id);
      setSavedSnapshot(JSON.stringify(banners));
      setActiveSlotKey(selectedBanner.slots?.[0]?.slot_key ?? 'left');
      setActiveElementKey(null);
    }
  }, [banners, selectedBanner]);

  const activeBanner = useMemo(
    () => localBanners.find(banner => banner.id === activeId) ?? localBanners[0],
    [localBanners, activeId]
  );

  // ── Navigation ────────────────────────────────────────────────────────────────

  const handleSelectBanner = (id: number) => {
    const banner = localBanners.find(b => b.id === id);
    setActiveId(id);
    setActiveSlotKey(banner?.slots?.[0]?.slot_key ?? 'left');
    setActiveElementKey(null);
  };

  /** Navigate to a slot — clears any element selection */
  const handleSlotSelect = (slotKey: string) => {
    setActiveSlotKey(slotKey);
    setActiveElementKey(null);
  };

  /** Select a specific element inside a slot (from preview click or inspector) */
  const handleElementSelect = (slotKey: string, elementKey: string) => {
    setActiveSlotKey(slotKey);
    setActiveElementKey(elementKey);
  };

  const isDirty = useMemo(
    () => JSON.stringify(localBanners) !== savedSnapshot,
    [localBanners, savedSnapshot]
  );

  const updateBanner = (bannerId: number, path: string, value: any) => {
    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== bannerId) return banner;
      const updated = structuredClone(banner);
      const keys = path.split('.');
      let cursor: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (cursor[key] === undefined || cursor[key] === null) {
          cursor[key] = {};
        }
        cursor = cursor[key];
      }
      
      cursor[keys[keys.length - 1]] = value;
      return updated;
    }));
  };

  // ── Slot visibility toggle with equal width redistribution ────────────────────
  const handleToggleSlotVisibility = (slotKey: string) => {
    if (!activeBanner) return;

    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== activeId) return banner;
      const cloned = structuredClone(banner);
      let target = cloned.slots.find(s => s.slot_key === slotKey);

      if (!target) {
        // Create new slot if it doesn't exist (Activating it)
        target = {
          slot_key: slotKey,
          is_visible: true,
          width: '100', // Will be redistributed
          bg_color: banner.bg_color,
          elements: {
            eyebrow: { text: '', visible: false },
            title: { text: 'New Slot', visible: true },
            paragraph: { text: '', visible: false },
            button: { text: 'Learn More', visible: false },
          },
          main_media: null,
          secondary_media: null,
        } as any;
        cloned.slots.push(target as any);
      } else {
        // Prevent hiding the last visible slot
        const visibleCount = cloned.slots.filter(s => s.is_visible).length;
        if (target.is_visible && visibleCount === 1) return banner;

        target.is_visible = !target.is_visible;
      }

      // Redistribute 100% equally across all now-visible slots
      const visible = cloned.slots.filter(s => s.is_visible);
      const base    = Math.floor(100 / visible.length);
      const rem     = 100 - base * visible.length;
      visible.forEach((s, i) => {
        s.width = String(base + (i === 0 ? rem : 0));
      });

      return cloned;
    }));
  };

  // ── Media ─────────────────────────────────────────────────────────────────────
  const handleMediaChange = async (slotIndex: number, file: File, isSecondary = false) => {
    const slot = activeBanner.slots[slotIndex];
    if (!slot) return;
    
    const mediaPath = isSecondary ? 'secondary_media' : 'main_media';
    const basePath = `slots.${slotIndex}.${mediaPath}`;
    const uploadKey = `${slotIndex}_${isSecondary ? 'sec' : 'main'}`;

    try {
      setUploadingMedia(prev => ({ ...prev, [uploadKey]: true }));
      
      // 1. Perform real-time upload with 30s timeout
      const uploadPromise = uploadProductFiles(file, "banner", "banner", String(activeId));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timed out. Please try again.')), 30000)
      );

      const data = await Promise.race([uploadPromise, timeoutPromise]) as any;
      
      // 2. Update state with the returned ID and URL from the server
      if (data.media) {
        updateBanner(activeId, `${basePath}.id`,  data.media.id);
        updateBanner(activeId, `${basePath}.url`, data.media.url);
        updateBanner(activeId, `${basePath}.media_type`, data.media.media_type || 'image');
      }
    } catch (error: any) {
      console.error('Real-time upload failed:', error);
      addToast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        type: "error",
      });
    } finally {
      setUploadingMedia(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // ── Publish ───────────────────────────────────────────────────────────────────
  const handlePublish = () => {
    if (!isDirty || isSaving || !activeBanner) return;

    const form = new FormData();
    form.append('name',          activeBanner.name);
    form.append('direction',     activeBanner.direction);
    form.append('aspect_ratio',  activeBanner.aspect_ratio);
    form.append('border_radius', activeBanner.border_radius);
    form.append('bg_color',      activeBanner.bg_color);
    form.append('slots',         JSON.stringify(activeBanner.slots));
    form.append('_method',       'PUT');

    router.post(route('banners.update', { banner: activeBanner.slug }), form, {
      onBefore:  () => setIsSaving(true),
      onSuccess: (page) => {
        const freshBanners = (page.props.banners as Banner[]) ?? localBanners;
        setLocalBanners(freshBanners);
        setSavedSnapshot(JSON.stringify(freshBanners));
      },
      onFinish: () => setIsSaving(false),
    });
  };

  // ── Add Banner ────────────────────────────────────────────────────────────────
  const handleAddBanner = (templateKey: string) => {
    router.post(route('banners.store'), { template_key: templateKey }, {
      onSuccess: (page) => {
        const freshBanners = (page.props.banners as Banner[]) ?? localBanners;
        setLocalBanners(freshBanners);
        setSavedSnapshot(JSON.stringify(freshBanners));
        const newest = freshBanners[freshBanners.length - 1];
        if (newest) {
          setActiveId(newest.id);
          setActiveSlotKey(newest.slots?.[0]?.slot_key ?? 'left');
          setActiveElementKey(null);
        }
      },
    });
  };

  // ── Factory Reset ─────────────────────────────────────────────────────────────
  const resetToFactory = () => {
    const factoryRecord = app_factory_config.find(
      (record: any) => record.config_key === `banners.${activeBanner.key}`
    );
    if (!factoryRecord) return;

    const payload = factoryRecord.payload;

    setLocalBanners(prev => prev.map(banner => {
      if (banner.id !== activeId) return banner;
      return {
        ...banner,
        name:          payload.name,
        direction:     payload.direction,
        is_active:     payload.is_active,
        aspect_ratio:  payload.aspect_ratio,
        border_radius: payload.border_radius,
        bg_color:      payload.bg_color,
        slots:         structuredClone(payload.slots),
      };
    }));

    setActiveSlotKey(payload.slots?.[0]?.slot_key ?? 'left');
    setActiveElementKey(null);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: theme.bg, color: theme.text }}>
      <BannerNav
        open={leftOpen}
        onToggle={() => setLeftOpen(v => !v)}
        banners={localBanners}
        activeId={activeId}
        onSelect={handleSelectBanner}
      />

      {!activeBanner ? (
        <div className="flex-1 flex items-center justify-center" style={{ color: theme.textMuted }}>
          <div className="text-center">
            <p>No banners found. Create your first banner to get started.</p>
          </div>
        </div>
      ) : (
        <>
          <BannerCenterPanel
            activeBanner={activeBanner}
            activeSlotKey={activeSlotKey}
            activeElementKey={activeElementKey}
            onSlotSelect={handleSlotSelect}
            onElementSelect={handleElementSelect}
            onToggleSlotVisibility={handleToggleSlotVisibility}
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={resetToFactory}
            onPublish={handlePublish}
            onUpdate={(path: string, value: any) => updateBanner(activeBanner.id, path, value)}
            onAddBanner={handleAddBanner}
            availableBannerTemplates={available_banner_templates}
            errors={errors}
            uploadingMedia={uploadingMedia}
          />

          <BannerInspector
            open={rightOpen}
            onToggle={() => setRightOpen(v => !v)}
            banner={activeBanner}
            activeSlotKey={activeSlotKey}
            activeElementKey={activeElementKey}
            onElementSelect={handleElementSelect}
            onUpdate={(path: string, value: any) => updateBanner(activeBanner.id, path, value)}
            onMediaChange={handleMediaChange}
            uploadingMedia={uploadingMedia}
          />
        </>
      )}
    </div>
  );
}

BannerEditor.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;

