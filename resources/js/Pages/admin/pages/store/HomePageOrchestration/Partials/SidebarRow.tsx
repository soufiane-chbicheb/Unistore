import { useState } from 'react';
import { GripVertical, MoreVertical } from 'lucide-react';
import type { Section } from '@/types/homeEditor';
import { ThemePalette } from '@/types/ThemeTypes';
import { typePill } from './ThemeUtils';
import { SectionMenu } from './SectionMenu';

type Action = 'move_to_start' | 'move_up' | 'move_down' | 'move_to_end';

type SidebarRowProps = {
  section: Section;
  index: number;
  total: number;
  theme: ThemePalette;
  isMenuOpen: boolean;
  isDragging: boolean;
  showTopIndicator: boolean;
  showBottomIndicator: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  onToggleMenu: (orc_id: number | null) => void;
  onMove: (orc_id: number, action: Action) => void;
  onNavigate: (section: Section) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
};

export function SidebarRow({
  section,
  index,
  total,
  theme,
  isMenuOpen,
  isDragging,
  showTopIndicator,
  showBottomIndicator,
  menuRef,
  onToggleMenu,
  onMove,
  onNavigate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SidebarRowProps) {
  const [hovered, setHovered] = useState(false);
  const isBanner = section.type === 'banner';

  const subLabel = isBanner
    ? `${(section.data as any).slots?.filter((s: any) => s.is_visible && s.width !== '0').length || 0} slots`
    : `${(section.data as any).products?.length || 0} products`;

  const isActive = isMenuOpen || hovered;

  return (
    <div style={{ position: 'relative' }}>
      {/* Top drop indicator */}
      {showTopIndicator && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 2, background: theme.accent, zIndex: 10,
        }} />
      )}

      <div
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={() => onDrop(index)}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px 12px 0',
          cursor: 'pointer',
          borderLeft: `4px solid ${isActive ? theme.primary : 'transparent'}`,
          borderBottom: `1px solid ${theme.border}`,
          background: isActive ? `${theme.primary}0D` : 'transparent',
          opacity: isDragging ? 0.4 : 1,
          transition: 'all 0.15s ease',
          position: 'relative',
        }}
      >
        {/* Drag handle */}
        <div style={{
          paddingLeft: 8,
          color: theme.textSecondary,
          cursor: 'grab',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.1s',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
          <GripVertical size={13} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: isActive ? theme.primary : theme.text,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}>
            {(section.data as any).name}
          </div>
          <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 1 }}>
            {subLabel}
          </div>
        </div>

        {/* Type pill */}
        <span style={typePill(isBanner ? 'banner' : 'collection', theme)}>
          {isBanner ? 'banner' : 'coll'}
        </span>

        {/* Order number */}
        <span style={{ fontSize: 10, color: theme.textSecondary, flexShrink: 0 }}>
          {String(section.order).padStart(2, '0')}
        </span>

        {/* Dots menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu(isMenuOpen ? null : section.orc_id);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            padding: '3px 4px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            opacity: hovered || isMenuOpen ? 1 : 0,
            transition: 'opacity 0.1s',
            flexShrink: 0,
          }}
        >
          <MoreVertical size={13} />
        </button>

        {isMenuOpen && (
          <SectionMenu
            section={section}
            index={index}
            total={total}
            theme={theme}
            menuRef={menuRef}
            onMove={onMove}
            onNavigate={onNavigate}
          />
        )}
      </div>

      {/* Bottom drop indicator */}
      {showBottomIndicator && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2, background: theme.accent, zIndex: 10,
        }} />
      )}
    </div>
  );
}
