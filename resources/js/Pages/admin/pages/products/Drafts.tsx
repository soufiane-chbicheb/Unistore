import { Edit2, Upload, MoreVertical, Copy, Trash2, Image as ImageIcon, Plus, Eye, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import styled, { keyframes } from 'styled-components';
import { useBackendInteraction } from '@/functions/product/useBackendInteractions';
import { useToast } from '@/contextHooks/useToasts';
import AppLoading from '@/components/AppLoading';
import { Draft } from '@/types/inertia';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Variant {
  id: string;
  price: number;
  stock: number;
  is_default: boolean;
  attrs: Record<string, any>;
}



interface DraftRowProps {
  draft: Draft;
  isFirst: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
}

// ─── Skeleton Animations ──────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    rgba(150,150,150,0.08) 0%,
    rgba(150,150,150,0.18) 40%,
    rgba(150,150,150,0.08) 80%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  border-radius: 6px;
`;

const SkeletonImg = styled(SkeletonBase)`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const SkeletonLine = styled(SkeletonBase) <{ $w?: string; $h?: string }>`
  height: ${({ $h }) => $h ?? '10px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 999px;
`;

const SkeletonBtn = styled(SkeletonBase)`
  height: 28px;
  width: 64px;
  border-radius: 8px;
  flex-shrink: 0;
`;



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Drafts() {
  const [pageLoading, setPageLoading] = useState(true);
  const { state: { currentTheme: t } } = useAdminThemeCtx();
  const { flash, drafts = [] } = usePage().props;
  const { addToast } = useToast();
  const { destroyDraftProduct, duplicateDraft, loading, loadingMessage } = useBackendInteraction()

  // 2s page skeleton
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);


  // listen for flashes 

  useEffect(() => {
    if (!flash) return;
    if (flash.success) {
      return addToast({
        title: "Success",
        description: flash.success,
        type: "success"
      })
    }

    if (flash.error) {
      return addToast({
        title: "Error",
        description: flash.error,
        type: "error"
      })
    }
  }, [flash]);

  return (
    <div className="min-h-screen" style={{ background: t.bgSecondary }}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* actions loading  */}
        {loading && <AppLoading message={loadingMessage} />}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {pageLoading ? (
              <div className="flex flex-col gap-2">
                <SkeletonLine $w="140px" $h="20px" />
                <SkeletonLine $w="90px" $h="10px" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold mb-0.5" style={{ color: t.text }}>Drafts</h1>
                <p className="text-xs" style={{ color: t.textMuted }}>
                  {drafts.length} product{drafts.length !== 1 ? 's' : ''} in progress
                </p>
              </>
            )}
          </div>
          <button
            onClick={() => router.post(route('products.storeDraft'))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: t.primary, color: t.textInverse }}
          >
            <Plus size={14} /> New Product
          </button>
        </div>

        {/* Column headers */}
        {!pageLoading && drafts.length > 0 && (
          <div className="flex items-center gap-4 px-4 pb-2 mb-1 text-xs font-medium"
            style={{ color: t.textMuted }}>
            <div style={{ width: 56, flexShrink: 0 }} />
            <div className="flex-1">Product</div>
            <div className="w-24 text-center">Progress</div>
            <div style={{ width: 256 }} />
          </div>
        )}

        {/* Rows */}
        {pageLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => <DraftRowSkeleton key={i} t={t} />)}
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-dashed"
            style={{ borderColor: t.border }}>
            <ImageIcon className="mx-auto mb-3" size={36} style={{ color: t.textMuted }} />
            <p className="text-sm font-medium mb-1" style={{ color: t.text }}>No drafts yet</p>
            <p className="text-xs" style={{ color: t.textMuted }}>Create your first product to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {drafts.map((draft, index) => (
              <DraftRow
                key={draft.id}
                draft={draft}
                isFirst={index === 0}
                onDelete={() => destroyDraftProduct(String(draft.id))}
                onDuplicate={() => duplicateDraft(draft.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

Drafts.layout = (page: any) => <AdminLayout children={page} />;

// ─── Row Skeleton ─────────────────────────────────────────────────────────────

function DraftRowSkeleton({ t }: { t: any }) {
  return (
    <div
      className="rounded-xl border px-4 py-3 flex items-center gap-4"
      style={{ background: t.card, borderColor: t.border }}
    >
      <SkeletonImg />
      <div className="flex-1 flex flex-col gap-2.5">
        <SkeletonLine w="38%" h="12px" />
        <SkeletonLine w="55%" h="8px" />
      </div>
      <div className="flex gap-2 items-center flex-shrink-0">
        <SkeletonBtn />
        <SkeletonBtn />
        <SkeletonBtn />
        <SkeletonBtn style={{ width: 80 }} />
      </div>
    </div>
  );
}

// ─── Expanded Skeleton ────────────────────────────────────────────────────────

function ExpandedSkeleton({ t }: { t: any }) {
  return (
    <div
      className="px-4 py-4 border-t flex gap-5 items-start"
      style={{ borderColor: t.border, background: t.bgSecondary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
    >
      <div style={{ width: 56, flexShrink: 0 }} />
      <div className="flex-1 flex flex-col gap-3.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonLine w="80px" h="8px" style={{ flexShrink: 0, animationDelay: `${i * 0.1}s` }} />
            <SkeletonLine h="2px" style={{ animationDelay: `${i * 0.15}s` }} />
            <SkeletonLine w="48px" h="8px" style={{ flexShrink: 0, animationDelay: `${i * 0.1}s` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMinPrice(variants?: Variant[]): number | null {
  if (!variants?.length) return null;
  const prices = variants.map((v) => v.price).filter((p) => p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Progress Item ────────────────────────────────────────────────────────────

function ProgressItem({ label, value }: { label: string; value: number }) {
  const isComplete = value === 100;
  const isMissing = value === 0;
  const fillColor = isComplete ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444';
  const statusText = isComplete ? 'Complete' : isMissing ? 'Missing' : `${value}%`;
  const statusColor = isComplete ? '#16a34a' : isMissing ? '#9ca3af' : '#d97706';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 flex-shrink-0" style={{ color: '#9ca3af', fontWeight: 500 }}>
        {label}
      </span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '2px', background: '#e5e7eb' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: fillColor }}
        />
      </div>
      <span className="text-xs w-14 text-right flex-shrink-0" style={{ color: statusColor, fontWeight: 500 }}>
        {statusText}
      </span>
    </div>
  );
}

// ─── Draft Row ────────────────────────────────────────────────────────────────

export function DraftRow({ draft, onDelete, onDuplicate, isFirst }: DraftRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { state: { currentTheme: t } } = useAdminThemeCtx();

  // first row auto-expands with 2s skeleton
  useEffect(() => {
    if (!isFirst) return;
    const t1 = setTimeout(() => setExpanding(true), 100);
    const t2 = setTimeout(() => { setExpanding(false); setExpanded(true); }, 2100); // 👈 2s skeleton
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isFirst]);

  const handleExpand = () => {
    if (expanded) { setExpanded(false); return; }
    setExpanding(true);
    setTimeout(() => { setExpanding(false); setExpanded(true); }, 1500); // 👈 1.5s skeleton on click
  };

  const minPrice = getMinPrice(draft.variants);
  const variantCount = draft.variants?.length ?? 0;
  const coverImage = draft.thumbnail?.url ?? null;

  const thumbnailProgress = draft.thumbnail ? 100 : 0;
  const variantsProgress = variantCount > 0 ? 100 : 0;
  const descriptionProgress = draft.description
    ? Math.min(100, Math.round((draft.description.length / 200) * 100))
    : 0;
  const tagsProgress = draft.tags?.length ? Math.min(100, Math.round((draft.tags.length / 5) * 100)) : 0;
  const coversProgress = draft.covers?.length ? Math.min(100, Math.round((draft.covers.length / 4) * 100)) : 0;

  const scoreColor = draft.quality_score >= 75
    ? { text: '#15803d' }
    : draft.quality_score >= 50
      ? { text: '#b45309' }
      : { text: '#b91c1c' };

  return (
    <div
      className="rounded-xl border transition-shadow hover:shadow-sm"
      style={{ background: t.card, borderColor: t.border }}
    >
      {/* ── Main row ── */}
      <div className="flex items-center gap-4 px-4 py-3">

        {/* Thumbnail with skeleton */}
        <div 
          className="flex-shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity" 
          style={{ width: 56, height: 56 }}
          onClick={() => router.visit(route('product.edit', { product: draft.slug || draft.id }))}
        >
          {coverImage ? (
            <>
              {!imgLoaded && (
                <SkeletonImg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              )}
              <img
                src={coverImage}
                alt={draft.name}
                className="rounded-lg object-cover w-full h-full"
                style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s' }}
                onLoad={() => setImgLoaded(true)}
              />
            </>
          ) : (
            <div
              className="rounded-lg flex items-center justify-center w-full h-full"
              style={{ background: t.bgSecondary, border: `1px dashed ${t.border}` }}
            >
              <ImageIcon size={18} style={{ color: t.textMuted }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.visit(route('product.edit', { product: draft.slug || draft.id }))}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold truncate" style={{ color: t.text }}>
              {draft.name || 'Untitled Product'}
            </h3>
            {draft.ready_to_publish && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
                style={{ background: '#f0fdf4', color: '#15803d' }}>
                Ready
              </span>
            )}
          </div>
          <p className="text-xs truncate" style={{ color: t.textMuted }}>
            {[
              draft.nichCategory?.name ?? 'No category',
              draft.brand,
              minPrice !== null ? `$${minPrice}` : null,
              variantCount > 0 ? `${variantCount} variant${variantCount !== 1 ? 's' : ''}` : null,
              getTimeAgo(draft.updated_at),
            ].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Progress toggle */}
        <button
          onClick={handleExpand}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-75 flex-shrink-0"
          style={{ background: t.bgSecondary, border: `1px solid ${t.border}` }}
        >
          <div className="flex gap-0.5 items-center">
            {[thumbnailProgress, variantsProgress, descriptionProgress, tagsProgress, coversProgress].map((v, i) => (
              <div key={i} className="rounded-full" style={{
                width: 6, height: 6,
                background: v === 100 ? '#22c55e' : v > 0 ? '#f59e0b' : '#e5e7eb',
              }} />
            ))}
          </div>
          <span className="text-xs font-semibold" style={{ color: scoreColor.text }}>
            {draft.quality_score}%
          </span>
          <ChevronDown
            size={12}
            style={{
              color: t.textMuted,
              transform: (expanded || expanding) ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button

            onClick={() => router.visit(route('product.show', { product: draft.slug || draft.id }))}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors hover:opacity-75"
            style={{ borderColor: t.border, color: t.textSecondary, background: 'transparent' }}
          >
            <Eye size={12} /> Preview
          </button>
          <button
            onClick={() => router.visit(route('product.edit', { product: draft.slug || draft.id }))}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors hover:opacity-75"
            style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
          >
            <Edit2 size={12} /> Edit
          </button>
          <button
            onClick={() => router.patch(route('product.publish', { product: draft.id }))}
            disabled={!draft.ready_to_publish}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{
              background: draft.ready_to_publish ? t.primary : t.bgSecondary,
              color: draft.ready_to_publish ? t.textInverse : t.textMuted,
              cursor: draft.ready_to_publish ? 'pointer' : 'not-allowed',
            }}
          >
            <Upload size={12} /> Publish
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg border transition-colors hover:opacity-75"
              style={{ borderColor: t.border, color: t.textMuted }}
            >
              <MoreVertical size={13} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg shadow-lg border py-1 z-20"
                  style={{ background: t.card, borderColor: t.border }}>
                  <button onClick={() => { onDuplicate(); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-70"
                    style={{ color: t.text }}>
                    <Copy size={12} /> Duplicate
                  </button>
                  <button onClick={() => { if (confirm('Delete this draft?')) onDelete(); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:opacity-70"
                    style={{ color: '#ef4444' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Expanding skeleton ── */}
      {expanding && <ExpandedSkeleton t={t} />}

      {/* ── Expanded progress bars ── */}
      {expanded && !expanding && (
        <div
          className="px-4 py-4 border-t flex gap-5 items-start"
          style={{ borderColor: t.border, background: t.bgSecondary, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
        >
          <div style={{ width: 56, flexShrink: 0 }} />
          <div className="flex-1 flex flex-col gap-3">
            <ProgressItem label="Thumbnail" value={thumbnailProgress} />
            <ProgressItem label="Variants" value={variantsProgress} />
            <ProgressItem label="Description" value={descriptionProgress} />
            <ProgressItem label="Tags" value={tagsProgress} />
            <ProgressItem label="Covers" value={coversProgress} />
          </div>
        </div>
      )}
    </div>
  );
}

