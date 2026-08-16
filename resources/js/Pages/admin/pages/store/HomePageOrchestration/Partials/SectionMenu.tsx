import type { Section } from '@/types/homeEditor';
import { ThemePalette } from '@/types/ThemeTypes';

type Action = 'move_to_start' | 'move_up' | 'move_down' | 'move_to_end';

type SectionMenuProps = {
  section: Section;
  index: number;
  total: number;
  theme: ThemePalette;
  menuRef: React.RefObject<HTMLDivElement>;
  onMove: (id: number, action: Action) => void;
  onNavigate: (section: Section) => void;
};

export function SectionMenu({
  section,
  index,
  total,
  theme,
  menuRef,
  onMove,
  onNavigate,
}: SectionMenuProps) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const isBanner = section.type === 'banner';

  const item = (label: string, action: () => void, disabled = false) => (
    <button
      key={label}
      onClick={disabled ? undefined : action}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '7px 14px',
        textAlign: 'left',
        fontSize: 12,
        background: 'none',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? theme.textMuted : theme.text,
        opacity: disabled ? 0.35 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = theme.sidebarHover;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'none';
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        right: 12,
        top: '100%',
        marginTop: 4,
        width: 196,
        zIndex: 50,
        background: theme.modal,
        border: `1px solid ${theme.borderHover}`,
        borderRadius: 8,
        padding: '4px 0',
        boxShadow: theme.shadowMd,
      }}
    >
      {item('⏫  Move to start', () => onMove(section.orc_id, 'move_to_start'), isFirst)}
      {item('↑  Move up',       () => onMove(section.orc_id, 'move_up'),       isFirst)}
      {item('↓  Move down',     () => onMove(section.orc_id, 'move_down'),     isLast)}
      {item('⏬  Move to end',  () => onMove(section.orc_id, 'move_to_end'),   isLast)}
      <div style={{ height: 1, margin: '4px 0', background: theme.border }} />
      {item(
        isBanner ? '✎  Manage banner' : '✎  Manage collection',
        () => onNavigate(section),
      )}
    </div>
  );
}
