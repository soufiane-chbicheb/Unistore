import { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import type { Section } from '@/types/homeEditor';
import { Sidebar } from './Partials/Sidebar';
import { PreviewPanel } from './Partials/PreviewPanel';
import { router } from '@inertiajs/react';

// ─── HomeEditor ───────────────────────────────────────────────────────────────

interface HomeEditorProps {
  sections: Section[];
}

export default function HomeEditor({ sections: initialSections }: HomeEditorProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const [sections,      setSections]      = useState<Section[]>(initialSections || []);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [openMenuId,    setOpenMenuId]    = useState<number | null>(null);
  const [draggedIndex,  setDraggedIndex]  = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ index: number; position: 'top' | 'bottom' } | null>(null);
  const [isPublishing,  setIsPublishing]  = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const reorder = (arr: Section[]): Section[] =>
    arr.map((s, i) => ({ ...s, order: i + 1 }));

  const handleMove = (orc_id: number, action: 'move_to_start' | 'move_up' | 'move_down' | 'move_to_end') => {
    const ci = sections.findIndex(s => s.orc_id === orc_id);
    if (ci === -1) return;
    let ni = ci;
    if      (action === 'move_to_start') ni = 0;
    else if (action === 'move_up')       ni = Math.max(0, ci - 1);
    else if (action === 'move_down')     ni = Math.min(sections.length - 1, ci + 1);
    else if (action === 'move_to_end')   ni = sections.length - 1;
    if (ni === ci) return;
    const arr = [...sections];
    const [moved] = arr.splice(ci, 1);
    arr.splice(ni, 0, moved);
    setSections(reorder(arr));
    setOpenMenuId(null);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDropIndicator({
      index,
      position: e.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom',
    });
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    let ti = index;
    if (dropIndicator?.position === 'bottom') ti += 1;
    if (draggedIndex < ti) ti -= 1;
    const arr = [...sections];
    const [moved] = arr.splice(draggedIndex, 1);
    arr.splice(ti, 0, moved);
    setSections(reorder(arr));
    setDraggedIndex(null);
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropIndicator(null);
  };

  const handleNavigate = (section: Section) => {
    const slug = (section.data as any).slug || (section.data as any).key;
    const url = section.type === 'banner' 
        ? `/store/banners/${slug}` 
        : `/store/collections/${slug}`;
    
    window.location.href = url;
    setOpenMenuId(null);
  };

  const handlePublish = () => {
    if (isPublishing) return;
    setIsPublishing(true);

    router.post('/store/home-editor/publish', {
      sections: sections.map((s, i) => ({
        id: s.orc_id,
        order: i + 1,
      })),
    }, {
      onFinish: () => setIsPublishing(false),
      onSuccess: () => {
        console.log('Home layout published successfully');
      }
    });
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      <Sidebar
        sections={sections}
        theme={theme}
        isOpen={sidebarOpen}
        openMenuId={openMenuId}
        draggedIndex={draggedIndex}
        dropIndicator={dropIndicator}
        menuRef={menuRef}
        onToggle={() => setSidebarOpen(v => !v)}
        onToggleMenu={setOpenMenuId}
        onMove={handleMove}
        onNavigate={handleNavigate}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      />
      <PreviewPanel
        sections={sections}
        onPublish={handlePublish}
        onDiscard={() => setSections(initialSections)}
      />
    </div>
  );
}

HomeEditor.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

