import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { 
  ChevronRight, 
  PanelLeft, 
  MoreVertical, 
  GripVertical
} from "lucide-react";
import React, { useState } from "react";

interface CollectionEditorNavProps {
  open: boolean;
  onToggle: () => void;
  sections: CollectionPayload[];
  activeId: number;
  onSelect: (id: number) => void;
  dirtyId: number | null;
}

export default function CollectionEditorNav({
  open,
  onToggle,
  sections,
  activeId,
  onSelect,
  dirtyId,
}: CollectionEditorNavProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);



  return (
    <aside
      className="border-r flex-shrink-0 overflow-y-auto scrollbar-hide transition-all duration-300"
      style={{
        width: open ? "260px" : "40px",
        backgroundColor: theme.bgSecondary,
        borderColor: theme.border,
      }}
    >
      {/* Toggle row */}
      <div
        className="sticky top-0 z-10 p-3 border-b flex justify-between items-center whitespace-nowrap"
        style={{ 
          height: 56,
          backgroundColor: theme.bgSecondary, 
          borderColor: theme.border 
        }}
      >
        {open && (
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.textSecondary,
          }}>
            Site Structure
          </span>
        )}
        <button
          onClick={onToggle}
          style={{ color: theme.textSecondary }}
          className={`p-1 hover:bg-black/5 rounded transition-all ${!open ? "mx-auto" : ""}`}
        >
          {open ? <PanelLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Section list */}
      {open && (
        <div className="p-2 space-y-1">
          {sections.map((s) => {
            const isActive = activeId === s.id;
            const isMenuOpen = menuOpenId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="group relative"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px 12px 0',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${isActive ? theme.primary : "transparent"}`,
                  borderBottom: `1px solid ${theme.border}`,
                  backgroundColor: isActive ? `${theme.primary}0D` : "transparent",
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Drag handle */}
                <div style={{
                  paddingLeft: 8,
                  color: theme.textSecondary,
                  cursor: 'grab',
                  opacity: isActive ? 1 : 0.4,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <GripVertical size={13} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: isActive ? theme.primary : theme.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block'
                  }}>
                    {s.name}
                  </span>
                  <span style={{ 
                    fontSize: 11, 
                    color: theme.textSecondary,
                    display: 'block',
                    marginTop: 1
                  }}>
                    Rule based
                  </span>
                </div>

                {/* Type pill */}
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: `${theme.primary}15`,
                  color: theme.primary,
                  textTransform: 'lowercase',
                  flexShrink: 0,
                }}>
                  collection
                </span>

                {/* Order number */}
                <span style={{ fontSize: 10, color: theme.textSecondary, flexShrink: 0 }}>
                  {String(sections.indexOf(s) + 1).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-2">
                  {dirtyId === s.id && (
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    />
                  )}

                  {/* Menu Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : s.id);
                    }}
                    style={{ color: theme.textSecondary }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded transition-opacity"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Action Popover */}
                {isMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} 
                    />
                    <div
                      className="absolute right-2 top-10 z-30 w-36 rounded-xl border p-1 shadow-2xl animate-in fade-in zoom-in duration-150"
                      style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
                    >
                      {/* some actions  */}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

