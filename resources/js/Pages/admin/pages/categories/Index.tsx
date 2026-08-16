'use client';

import { useState } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  Plus, Pencil, Trash2, FolderTree, ChevronDown, ChevronRight,
  Tag, Ticket, Layers, FolderGit, Search, Filter, Hash,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParentRef {
  id: number;
  name: string;
  slug: string;
  parent_id: null;
}

interface ChildRef {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
}

interface Coupon {
  id: number;
  name: string;
  code: string;
  type: string;
  value: string;
  valid_until: string;
}

interface Promotion {
  id: number;
  name: string;
  type: string;
  value: string;
  valid_until: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  parent?:    ParentRef | null;
  childrens?: ChildRef[];
  coupons?:   Coupon[];
  promotions?: Promotion[];
  created_at: string;
  updated_at: string;
}

type FilterMode = 'all' | 'niches' | 'subs';

interface Props {
  categories: Category[] 
}
// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDiscount(type: string, value: string) {
  if (type === 'percentage') return `${value}% off`;
  if (type === 'fixed')      return `${value} MAD off`;
  return 'Free shipping';
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en', { day: '2-digit', month: 'short', year: '2-digit' });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const { state: { currentTheme: t } } = useAdminThemeCtx();
  const { categories: rawCategories } = usePage().props as Props;
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [search,     setSearch]     = useState('');
  const [deleteId,   setDeleteId]   = useState<number | null>(null);

  const br = t.borderRadius;
  const cats = rawCategories ?? [];

  const filtered = cats.filter(c => {
    const matchesMode =
      filterMode === 'all'    ? true :
      filterMode === 'niches' ? c.parent_id === null :
                                c.parent_id !== null;
    return matchesMode && c.name.toLowerCase().includes(search.toLowerCase());
  });

  const nicheCount = cats.filter(c => c.parent_id === null).length;
  const subCount   = cats.filter(c => c.parent_id !== null).length;

  // ── shared styles ────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: t.card, border: `1px solid ${t.border}`,
    borderRadius: br, boxShadow: t.shadow,
  };

  const pill = (color: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 10, fontWeight: 700, padding: '2px 8px',
    background: `${color}15`, color,
    border: `1px solid ${color}30`, borderRadius: 999,
  });

  const filterBtn = (active: boolean, color = t.primary): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: br,
    border: `1.5px solid ${active ? color : t.border}`,
    background: active ? `${color}12` : 'transparent',
    color: active ? color : t.textSecondary,
    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
  });

  const infoBlock = (label: string, value: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: t.text, fontSize: 12 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: 32 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Catalogue</p>
          <h1 style={{ color: t.text, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Categories</h1>
          <p style={{ color: t.textSecondary, fontSize: 13, margin: '4px 0 0' }}>Manage niches and sub-categories</p>
        </div>
        <Link href={route('categories.create')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: t.primary, color: t.textInverse, borderRadius: br, padding: '9px 18px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          <Plus size={15} /> Add category
        </Link>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.textMuted, pointerEvents: 'none' }} />
          <input type="text" placeholder="Search categories…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: t.bgSecondary, border: `1px solid ${t.border}`, color: t.text, borderRadius: br, width: '100%', padding: '8px 12px 8px 32px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderColor = t.borderHover)}
            onBlur={e  => (e.currentTarget.style.borderColor = t.border)} />
        </div>

        <button style={filterBtn(filterMode === 'all')} onClick={() => setFilterMode('all')}>
          <Filter size={12} /> All
          <span style={{ ...pill(t.textMuted), padding: '1px 6px' }}>{cats.length}</span>
        </button>
        <button style={filterBtn(filterMode === 'niches', t.primary)} onClick={() => setFilterMode('niches')}>
          <Layers size={12} /> Niches
          <span style={{ ...pill(t.primary), padding: '1px 6px' }}>{nicheCount}</span>
        </button>
        <button style={filterBtn(filterMode === 'subs', t.accent)} onClick={() => setFilterMode('subs')}>
          <FolderGit size={12} /> Sub-categories
          <span style={{ ...pill(t.accent), padding: '1px 6px' }}>{subCount}</span>
        </button>
      </div>

      {/* ── Table ── */}
      <div style={card}>

        {/* header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 80px', padding: '10px 16px', borderBottom: `1px solid ${t.border}`, background: t.bgSecondary, borderRadius: `${br} ${br} 0 0` }}>
          {['', 'Name', 'Type', 'Actions'].map((h, i) => (
            <span key={i} style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: i >= 3 ? 'center' : 'left' }}>
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: t.textMuted, fontSize: 13 }}>
            No categories found.
          </div>
        ) : (
          filtered.map((cat, i) => {
            const isNiche    = cat.parent_id === null;
            const isExpanded = expandedId === cat.id;
            const isLast     = i === filtered.length - 1;
            const couponCount  = cat.coupons?.length    ?? 0;
            const promoCount   = cat.promotions?.length ?? 0;
            const childCount   = cat.childrens?.length  ?? 0;
            const hasDetails   = true; // always expandable — always has slug, date, etc.

            return (
              <div key={cat.id} style={{ borderBottom: isLast ? 'none' : `1px solid ${t.border}` }}>

                {/* ── main row ── */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                  style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 80px', padding: '12px 16px', alignItems: 'center', background: isExpanded ? `${t.primary}06` : 'transparent', transition: 'background .1s', cursor: 'pointer' }}
                >
                  {/* chevron */}
                  <div style={{ color: t.textMuted, display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>

                  {/* name + slug */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ background: isNiche ? `${t.primary}15` : `${t.accent}15`, borderRadius: br, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isNiche ? <Layers size={13} style={{ color: t.primary }} /> : <FolderGit size={13} style={{ color: t.accent }} />}
                    </div>
                    <div>
                      <p style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: 0 }}>{cat.name}</p>
                      <p style={{ color: t.textMuted, fontSize: 11, margin: 0, fontFamily: 'monospace' }}>{cat.slug}</p>
                    </div>
                  </div>

                  {/* type badge */}
                  <div>
                    <span style={isNiche ? pill(t.primary) : pill(t.accent)}>
                      {isNiche ? <Layers size={9} /> : <FolderGit size={9} />}
                      {isNiche ? 'Niche' : 'Sub'}
                    </span>
                  </div>

                  {/* actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                       onClick={e => e.stopPropagation()}>
                    <Link href={route('categories.edit' , cat.slug)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: br, background: 'transparent', border: `1px solid ${t.border}`, color: t.textSecondary, textDecoration: 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = t.bgSecondary; e.currentTarget.style.color = t.text; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = t.textSecondary; }}>
                      <Pencil size={11} />
                    </Link>
                    <button onClick={() => setDeleteId(cat.id)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: br, background: 'transparent', border: `1px solid ${t.border}`, color: t.error, cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.background = `${t.error}12`; e.currentTarget.style.borderColor = t.error; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = t.border; }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* ── expanded panel ── */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 16px 58px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* info strip */}
                    <div style={{ display: 'flex', gap: 32, padding: '12px 16px', background: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: br }}>
                      {infoBlock('ID', `#${cat.id}`)}
                      {infoBlock('Slug', <code style={{ fontFamily: 'monospace', fontSize: 12, color: t.accent }}>{cat.slug}</code>)}
                      {infoBlock('Created', fmtDate(cat.created_at))}
                      {infoBlock('Updated', fmtDate(cat.updated_at))}
                      {isNiche && infoBlock('Children', childCount > 0 ? `${childCount} sub-categories` : 'None')}
                    </div>

                    {/* sub-category → show parent */}
                    {!isNiche && cat.parent && (
                      <div style={{ padding: '10px 14px', background: `${t.primary}08`, border: `1px solid ${t.primary}25`, borderRadius: br, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Layers size={13} style={{ color: t.primary, flexShrink: 0 }} />
                        <div>
                          <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Parent niche</span>
                          <p style={{ color: t.text, fontSize: 13, fontWeight: 600, margin: '2px 0 0' }}>
                            {cat.parent.name}
                            <code style={{ marginLeft: 8, fontFamily: 'monospace', fontSize: 11, color: t.textMuted }}>/{cat.parent.slug}</code>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* niche → show children */}
                    {isNiche && (cat.childrens?.length ?? 0) > 0 && (
                      <div style={{ border: `1px solid ${t.border}`, borderRadius: br, overflow: 'hidden' }}>
                        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${t.border}`, background: t.bgSecondary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FolderGit size={12} style={{ color: t.accent }} />
                          <span style={{ color: t.text, fontSize: 11, fontWeight: 700 }}>Sub-categories</span>
                          <span style={{ ...pill(t.accent), marginLeft: 'auto', padding: '1px 6px' }}>{cat.childrens!.length}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 12 }}>
                          {cat.childrens!.map(child => (
                            <span key={child.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: 999, fontSize: 12, color: t.text }}>
                              <Hash size={10} style={{ color: t.textMuted }} />
                              {child.name}
                              <code style={{ fontFamily: 'monospace', fontSize: 10, color: t.textMuted }}>{child.slug}</code>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* coupons */}
                    {couponCount > 0 && (
                      <div style={{ border: `1px solid ${t.border}`, borderRadius: br, overflow: 'hidden' }}>
                        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${t.border}`, background: t.bgSecondary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Ticket size={12} style={{ color: t.success }} />
                          <span style={{ color: t.text, fontSize: 11, fontWeight: 700 }}>Coupons</span>
                          <span style={{ ...pill(t.success), marginLeft: 'auto', padding: '1px 6px' }}>{couponCount}</span>
                        </div>
                        {cat.coupons!.map((c, ci) => (
                          <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderTop: ci !== 0 ? `1px solid ${t.border}` : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: t.text, fontSize: 12, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{c.code}</span>
                              <span style={{ color: t.accent, fontSize: 11 }}>{fmtDiscount(c.type, c.value)}</span>
                            </div>
                            <span style={{ color: t.textMuted, fontSize: 10 }}>exp {fmtDate(c.valid_until)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* promotions */}
                    {promoCount > 0 && (
                      <div style={{ border: `1px solid ${t.border}`, borderRadius: br, overflow: 'hidden' }}>
                        <div style={{ padding: '8px 12px', borderBottom: `1px solid ${t.border}`, background: t.bgSecondary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Tag size={12} style={{ color: t.primary }} />
                          <span style={{ color: t.text, fontSize: 11, fontWeight: 700 }}>Promotions</span>
                          <span style={{ ...pill(t.primary), marginLeft: 'auto', padding: '1px 6px' }}>{promoCount}</span>
                        </div>
                        {cat.promotions!.map((p, pi) => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderTop: pi !== 0 ? `1px solid ${t.border}` : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: t.text, fontSize: 12, fontWeight: 600 }}>{p.name}</span>
                              <span style={{ color: t.accent, fontSize: 11 }}>{fmtDiscount(p.type, p.value)}</span>
                            </div>
                            <span style={{ color: t.textMuted, fontSize: 10 }}>ends {fmtDate(p.valid_until)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Delete modal ── */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 16 }}>
          <div style={{ background: t.modal, border: `1px solid ${t.border}`, borderRadius: br, boxShadow: t.shadowLg, width: '100%', maxWidth: 400, padding: 24 }}>
            <h2 style={{ color: t.text, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Delete category?</h2>
            <p style={{ color: t.textSecondary, fontSize: 13, lineHeight: 1.6, margin: '0 0 24px' }}>
              This cannot be undone. Sub-categories linked to this niche may be affected.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setDeleteId(null)}
                      style={{ background: 'transparent', border: `1px solid ${t.border}`, color: t.text, borderRadius: br, padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <Link href={route('categories.index')} method="delete" data={{ id: deleteId }} as="button"
                    style={{ background: t.error, border: 'none', color: '#fff', borderRadius: br, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => setDeleteId(null)}>
                Delete
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

Index.layout = (page: any) => <AdminLayout>{page}</AdminLayout>;

