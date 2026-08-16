'use client';

import React, { useState } from 'react';
import { usePage, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { useToast } from '@/contextHooks/useToasts';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Search, Tag, Ticket, Check, Plus, X, Megaphone, Layers, FolderTree, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryMode = 'add-niches' | 'add-subs';   // ← single flag

interface FormValues    { name: string; description?: string; }
interface NicheItem     { id: number; name: string; }
interface CouponItem    { id: number; name: string; code: string; type: string; value: string; valid_until: string; }
interface PromotionItem { id: number; name: string; type: string; value: string; valid_until: string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeNiches(raw: any): NicheItem[] {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : Object.values(raw) as NicheItem[];
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en', { day: '2-digit', month: 'short' });
}
function fmtDiscount(type: string, value: string) {
  if (type === 'percentage') return `${value}% off`;
  if (type === 'fixed')      return `${value} MAD off`;
  return 'Free shipping';
}

const EmptyState = ({ color }: { color: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 8 }}>
    <Megaphone size={15} style={{ color }} />
    <p style={{ color, fontSize: 11, margin: 0 }}>Nothing found</p>
  </div>
);

// ─── Warn modal ──────────────────────────────────────────────────────────────

function WarnModal({
  from, to, onConfirm, onCancel, t,
}: {
  from: CategoryMode; to: CategoryMode;
  onConfirm: () => void; onCancel: () => void;
  t: any;
}) {
  const br = t.borderRadius;
  const fromLabel = from === 'add-niches' ? 'niche category' : 'sub-category';
  const toLabel   = to   === 'add-niches' ? 'niche category' : 'sub-category';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: br, padding: 24, width: 360, boxShadow: t.shadowLg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ background: `${t.warning}20`, borderRadius: br, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={16} style={{ color: t.warning }} />
          </div>
          <p style={{ color: t.text, fontSize: 14, fontWeight: 700, margin: 0 }}>Switch to {toLabel}?</p>
        </div>

        <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.6, margin: '0 0 20px' }}>
          You're switching from <strong style={{ color: t.text }}>{fromLabel}</strong> to <strong style={{ color: t.text }}>{toLabel}</strong>.
          <br />
          Your current selection will be <strong style={{ color: t.warning }}>cleared</strong>.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}
                  style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, borderRadius: br, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Keep {fromLabel}
          </button>
          <button type="button" onClick={onConfirm}
                  style={{ background: t.warning, border: 'none', color: t.textInverse, borderRadius: br, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Yes, switch
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Half panel ──────────────────────────────────────────────────────────────

const MIN_LIST_H = 180; // px — list never shrinks below this

function HalfPanel({
  title, desc, icon: Icon, color, enabled, onEnable,
  search, onSearch, items, selectedIds, onToggle,
  renderLabel, renderSub, appliedItems,
}: {
  title: string; desc: string; icon: any; color: string;
  enabled: boolean; onEnable: () => void;
  search: string; onSearch: (v: string) => void;
  items: any[]; selectedIds: number[]; onToggle: (id: number) => void;
  renderLabel: (i: any) => string;
  renderSub: (i: any) => React.ReactNode;
  appliedItems: any[];
}) {
  const { state: { currentTheme: t } } = useAdminThemeCtx();
  const br = t.borderRadius;

  return (
    <div style={{ flex: enabled ? '1 1 50%' : '0 0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderBottom: `1px solid ${t.border}`, transition: 'flex .2s' }}>

      {/* opt-in toggle — always visible */}
      <div style={{ flexShrink: 0, padding: '10px 14px', borderBottom: enabled ? `1px solid ${t.border}` : 'none' }}>
        <button type="button" onClick={onEnable}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: enabled ? `${color}0a` : 'transparent', border: `1.5px solid ${enabled ? color : t.border}`, borderRadius: br, padding: '9px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}>
          {/* checkbox */}
          <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${enabled ? color : t.border}`, background: enabled ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
            {enabled && <Check size={11} color={t.textInverse} strokeWidth={3} />}
          </div>
          <div style={{ background: `${color}15`, borderRadius: br, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={12} style={{ color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: enabled ? color : t.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{title}</p>
            <p style={{ color: t.textMuted, fontSize: 11, margin: 0 }}>{desc}</p>
          </div>
          {selectedIds.length > 0 && (
            <span style={{ background: `${color}20`, color, borderRadius: 999, fontSize: 11, fontWeight: 700, padding: '2px 8px', flexShrink: 0 }}>
              {selectedIds.length}
            </span>
          )}
        </button>
      </div>

      {/* list — only when enabled, with min height */}
      {enabled && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 14px 0', overflow: 'hidden' }}>
          {/* search */}
          <div style={{ position: 'relative', flexShrink: 0, marginBottom: 8 }}>
            <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: t.textMuted, pointerEvents: 'none' }} />
            <input type="text" placeholder="Search..." value={search} onChange={e => onSearch(e.target.value)}
              style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text, borderRadius: br, width: '100%', padding: '7px 12px 7px 30px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = t.borderHover)}
              onBlur={e  => (e.currentTarget.style.borderColor = t.border)} />
          </div>

          {/* scrollable rows — min height enforced */}
          <div style={{ minHeight: MIN_LIST_H, flex: 1, overflowY: 'auto', border: `1px solid ${t.border}`, borderRadius: br, marginBottom: 10 }}>
            {items.length === 0
              ? <EmptyState color={t.textMuted} />
              : items.map((item, i) => {
                  const on = selectedIds.includes(item.id);
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderTop: i !== 0 ? `1px solid ${t.border}` : 'none', background: on ? `${color}0d` : 'transparent', transition: 'background .1s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{ background: on ? `${color}20` : t.bgSecondary, borderRadius: br, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={10} style={{ color: on ? color : t.textMuted }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: t.text, fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{renderLabel(item)}</p>
                          <div style={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{renderSub(item)}</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => onToggle(item.id)}
                              style={{ background: on ? color : 'transparent', border: `1.5px solid ${on ? color : t.border}`, borderRadius: br, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginLeft: 8 }}>
                        {on ? <Check size={10} color={t.textInverse} /> : <Plus size={10} style={{ color: t.textMuted }} />}
                      </button>
                    </div>
                  );
                })}
          </div>

          {/* applied pills */}
          {appliedItems.length > 0 && (
            <div style={{ flexShrink: 0, paddingBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {appliedItems.map(item => (
                <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '2px 9px', background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 999 }}>
                  <Icon size={9} />
                  {renderLabel(item)}
                  <button type="button" onClick={() => onToggle(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color, padding: 0, display: 'flex', alignItems: 'center' }}>
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Create() {
  const { state: { currentTheme: t } } = useAdminThemeCtx();
  const { addToast } = useToast();
  const { category, niches: rawNiches, coupons: rawCoupons, promotions: rawPromotions } = usePage().props as any;

  // ── Inertia Form ─────────────────────────────────────────────────────────
  const { data, setData, post, processing, errors, reset } = useForm({
    id: category?.id || null,
    name: category?.name || '',
    description: category?.description || '',
    flag: (category?.parent_id ? 'add-subs' : 'add-niches') as CategoryMode,
    nich_id: category?.parent_id || null,
    coupon_ids: [] as number[],
    promotion_ids: [] as number[],
  });

  const [warnTo, setWarnTo] = useState<CategoryMode | null>(null);

  // ── marketing ─────────────────────────────────────────────────────────────
  const [assignCoupons, setAssignCoupons] = useState(false);
  const [assignPromotions, setAssignPromotions] = useState(false);
  const [couponSearch, setCouponSearch] = useState('');
  const [promoSearch, setPromoSearch] = useState('');

  const niches = normalizeNiches(rawNiches);
  const coupons = (rawCoupons as CouponItem[] ?? []);
  const promotions = (rawPromotions as PromotionItem[] ?? []);

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
    c.name.toLowerCase().includes(couponSearch.toLowerCase()));
  const filteredPromos = promotions.filter(p =>
    p.name.toLowerCase().includes(promoSearch.toLowerCase()));

  const toggleCoupon = (id: number) => {
    const newIds = data.coupon_ids.includes(id)
      ? data.coupon_ids.filter(x => x !== id)
      : [...data.coupon_ids, id];
    setData('coupon_ids', newIds);
  };

  const togglePromo = (id: number) => {
    const newIds = data.promotion_ids.includes(id)
      ? data.promotion_ids.filter(x => x !== id)
      : [...data.promotion_ids, id];
    setData('promotion_ids', newIds);
  };

  // ── mode switch with warn ─────────────────────────────────────────────────
  function requestModeSwitch(to: CategoryMode) {
    if (to === data.flag) return;
    const hasSelection = data.flag === 'add-subs' && data.nich_id !== null;
    if (hasSelection) {
      setWarnTo(to);
    } else {
      applyModeSwitch(to);
    }
  }

  function applyModeSwitch(to: CategoryMode) {
    setData(prev => ({ ...prev, flag: to, nich_id: null }));
    setWarnTo(null);
  }

  function handleSave(e?: React.SyntheticEvent) {
    if (e) e.preventDefault();

    if (data.flag === 'add-subs' && !data.nich_id) {
      addToast({ type: 'error', title: 'Error', description: 'Please select a parent niche' });
      return;
    }

    post(route('categories.store'), {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Success', description: 'Category saved successfully' });
      },
      onError: (err) => {
        console.error('Validation Errors:', err);
        addToast({ type: 'error', title: 'Validation Failed', description: 'Please check the form for errors' });
      }
    });
  }

  const br = t.borderRadius;
  const TOPBAR = 57;

  const card: React.CSSProperties = { background: t.card, border: `1px solid ${t.border}`, borderRadius: br, boxShadow: t.shadow, padding: 20 };
  const sLbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.textMuted, marginBottom: 14 };

  const chk = (on: boolean, color: string): React.CSSProperties => ({
    width: 17, height: 17, borderRadius: 4,
    border: `1.5px solid ${on ? color : t.border}`,
    background: on ? color : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all .12s',
  });

  const fieldInput = (mono = false): React.CSSProperties => ({
    background: t.bg, border: `1px solid ${t.border}`, color: t.text,
    borderRadius: br, width: '100%', padding: '8px 14px', fontSize: 12,
    outline: 'none', boxSizing: 'border-box',
    ...(mono ? { fontFamily: 'monospace' } : {}),
  });

  return (
    <div style={{ background: t.bg, minHeight: '100vh' }}>

      {/* warn modal */}
      {warnTo && (
        <WarnModal
          from={data.flag}
          to={warnTo}
          t={t}
          onConfirm={() => applyModeSwitch(warnTo)}
          onCancel={() => setWarnTo(null)}
        />
      )}

      {/* ── Topbar ── */}
      <div style={{ background: t.bgSecondary, borderBottom: `1px solid ${t.border}`, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 2px' }}>Catalogue</p>
          <h1 style={{ color: t.text, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>{data.id ? 'Edit category' : 'New category'}</h1>
        </div>
        <button type="button" onClick={handleSave} disabled={processing}
                style={{ background: processing ? t.bgSecondary : t.primary, color: processing ? t.textMuted : t.textInverse, borderRadius: br, border: 'none', cursor: processing ? 'not-allowed' : 'pointer', padding: '9px 22px', fontSize: 13, fontWeight: 600, transition: 'all .15s' }}
                onMouseEnter={e => !processing && (e.currentTarget.style.background = t.primaryHover)}
                onMouseLeave={e => !processing && (e.currentTarget.style.background = t.primary)}>
          {processing ? 'Saving...' : 'Save category'}
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, padding: 32, alignItems: 'start' }}>

        {/* ════ LEFT ════ */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Mode toggle — add-niches vs add-subs */}
          <div style={card}>
            <span style={sLbl}>Category type</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([
                { value: 'add-niches', Icon: Layers,     title: 'Niche category',  desc: 'Top level — Electronics, Fashion…' },
                { value: 'add-subs',   Icon: FolderTree, title: 'Sub-category',    desc: 'Belongs under a niche' },
              ] as const).map(opt => {
                const on = data.flag === opt.value;
                return (
                  <button key={opt.value} type="button"
                          onClick={() => requestModeSwitch(opt.value)}
                          style={{ background: on ? `${t.primary}12` : 'transparent', border: `1.5px solid ${on ? t.primary : t.border}`, borderRadius: br, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={chk(on, t.primary)}>
                      {on && <Check size={10} color={t.textInverse} strokeWidth={3} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <opt.Icon size={12} style={{ color: on ? t.primary : t.textMuted }} />
                        <span style={{ color: on ? t.primary : t.text, fontSize: 12, fontWeight: 600 }}>{opt.title}</span>
                      </div>
                      <span style={{ color: on ? t.primary : t.textMuted, fontSize: 11, opacity: .8 }}>{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.flag && <p style={{ color: t.error, fontSize: 11, marginTop: 8 }}>{errors.flag}</p>}
          </div>

          {/* Parent niche picker — only in add-subs mode */}
          {data.flag === 'add-subs' && (
            <div style={card}>
              <span style={sLbl}>Parent niche</span>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: br, overflow: 'hidden', maxHeight: 200, overflowY: 'auto' }}>
                {niches.length === 0
                  ? <EmptyState color={t.textMuted} />
                  : niches.map((n, i) => {
                      const on = data.nich_id === n.id;
                      return (
                        <div key={n.id} onClick={() => setData('nich_id', on ? null : n.id)}
                             style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderTop: i !== 0 ? `1px solid ${t.border}` : 'none', background: on ? `${t.primary}0d` : 'transparent', cursor: 'pointer' }}>
                          <div style={chk(on, t.primary)}>
                            {on && <Check size={10} color={t.textInverse} strokeWidth={3} />}
                          </div>
                          <span style={{ color: t.text, fontSize: 13, fontWeight: on ? 600 : 400 }}>{n.name}</span>
                        </div>
                      );
                    })}
              </div>
              {errors.nich_id ? (
                <p style={{ color: t.error, fontSize: 11, marginTop: 6 }}>{errors.nich_id}</p>
              ) : data.nich_id === null && (
                <p style={{ color: t.textMuted, fontSize: 11, marginTop: 6 }}>Please select a parent niche</p>
              )}
            </div>
          )}

          {/* Info */}
          <div style={card}>
            <span style={sLbl}>Info</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: t.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Name</label>
                <input type="text" placeholder="e.g. Electronics" value={data.name} onChange={e => setData('name', e.target.value)}
                  style={fieldInput()}
                  onFocus={e => (e.currentTarget.style.borderColor = t.borderHover)}
                  onBlur={e  => (e.currentTarget.style.borderColor = t.border)} />
                {errors.name && <p style={{ color: t.error, fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
              </div>
            
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', color: t.textSecondary, fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                  Description <span style={{ color: t.textMuted }}>(optional)</span>
                </label>
                <textarea rows={3} placeholder="Short description..." value={data.description} onChange={e => setData('description', e.target.value)}
                  style={{ ...fieldInput(), resize: 'none', lineHeight: 1.6 }}
                  onFocus={e => (e.currentTarget.style.borderColor = t.borderHover)}
                  onBlur={e  => (e.currentTarget.style.borderColor = t.border)} />
                {errors.description && <p style={{ color: t.error, fontSize: 11, marginTop: 4 }}>{errors.description}</p>}
              </div>
            </div>
          </div>
        </form>

        {/* ════ RIGHT — sticky, full height, 50/50 ════ */}
        <div style={{
          position: 'sticky', top: 24,
          height: `calc(100vh - ${TOPBAR + 48}px)`,
          background: t.card, border: `1px solid ${t.border}`,
          borderRadius: br, boxShadow: t.shadow,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* TOP 50% — Coupons */}
          <HalfPanel
            title="Assign coupons"
            desc="Apply coupon codes at checkout"
            icon={Ticket} color={t.success}
            enabled={assignCoupons}
            onEnable={() => { setAssignCoupons(v => { if (v) setData('coupon_ids', []); return !v; }); }}
            search={couponSearch} onSearch={setCouponSearch}
            items={filteredCoupons} selectedIds={data.coupon_ids} onToggle={toggleCoupon}
            renderLabel={c => c.code}
            renderSub={c => (
              <>
                <span style={{ color: t.accent }}>{fmtDiscount(c.type, c.value)}</span>
                <span style={{ color: t.textMuted }}> · exp {fmtDate(c.valid_until)}</span>
              </>
            )}
            appliedItems={coupons.filter(c => data.coupon_ids.includes(c.id))}
          />

          {/* BOTTOM 50% — Promotions */}
          <HalfPanel
            title="Assign promotions"
            desc="Products inherit category promotions"
            icon={Tag} color={t.primary}
            enabled={assignPromotions}
            onEnable={() => { setAssignPromotions(v => { if (v) setData('promotion_ids', []); return !v; }); }}
            search={promoSearch} onSearch={setPromoSearch}
            items={filteredPromos} selectedIds={data.promotion_ids} onToggle={togglePromo}
            renderLabel={p => p.name}
            renderSub={p => (
              <>
                <span style={{ color: t.accent }}>{fmtDiscount(p.type, p.value)}</span>
                <span style={{ color: t.textMuted }}> · ends {fmtDate(p.valid_until)}</span>
              </>
            )}
            appliedItems={promotions.filter(p => data.promotion_ids.includes(p.id))}
          />

        </div>
      </div>
    </div>
  );
}

Create.layout = (page: any) => <AdminLayout children={page} />;

