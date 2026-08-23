import { useAdminThemeCtx } from "@/contextHooks/useAdminThemeCtx";
import { Banner } from "@/types/bannerTypes";
import { PanelLeft, MoreVertical, GripVertical } from "lucide-react";
import { useState } from "react";

interface BannerNavProps {
  open: boolean;
  onToggle: () => void;
  banners: Banner[];
  activeId: number;
  onSelect: (id: number) => void;
}

type ReorderAction = 'increment' | 'decrement' | 'start' | 'end';

interface ReorderItem {
  label: string;
  action: ReorderAction;
  Icon: React.ElementType;
  disabledAt: 'first' | 'last';
}



export default function BannerNav({ open, onToggle, banners, activeId, onSelect }: BannerNavProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const getThumbnailUrl = (banner: Banner): string | null => {
    const imageSlot = banner.slots.find(slot => slot.main_media?.url);
    return imageSlot?.main_media?.url ?? null;
  };

  const closeMenu = () => setMenuOpenId(null);

  return (
    <aside style={{
      width: open ? 260 : 40,
      flexShrink: 0,
      borderRight: `1px solid ${theme.border}`,
      background: theme.bgSecondary,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: `1px solid ${theme.border}`,
      }}>
        {open && (
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.textSecondary,
            flex: 1,
          }}>
            My Banners
          </span>
        )}
        <button
          onClick={onToggle}
          style={{
            marginLeft: open ? 0 : 'auto', 
            background: 'none', border: 'none',
            color: theme.textSecondary, cursor: 'pointer', padding: 4,
          }}
          className="hover:bg-black/5 rounded transition-all"
        >
          <PanelLeft size={16} />
        </button>
      </div>

      {/* Banner list */}
      {open && (
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {banners.map((banner, index) => {
            const isActive   = banner.id === activeId;
            const isFirst    = index === 0;
            const isLast     = index === banners.length - 1;
            const thumb      = getThumbnailUrl(banner);
            const slotCount  = banner.slots.length;
            const isMenuOpen = menuOpenId === banner.id;

            return (
              <div key={banner.id} style={{ position: 'relative' }}>

                {/* Row */}
                <div
                  onClick={() => onSelect(banner.id)}
                  className="group relative"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px 12px 0',
                    cursor: 'pointer',
                    borderLeft: `4px solid ${isActive ? theme.primary : "transparent"}`,
                    borderBottom: `1px solid ${theme.border}`,
                    backgroundColor: banner.id === activeId ? `${theme.primary}0D` : "transparent",
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Drag handle */}
                  <div style={{
                    paddingLeft: 8,
                    color: theme.textSecondary,
                    cursor: 'grab',
                    opacity: banner.id === activeId ? 1 : 0.4,
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
                      color: banner.id === activeId ? theme.primary : theme.text,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                    }}>
                      {banner.name}
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 1 }}>
                      {banner.is_active ? 'Live' : 'Hidden'} · {banner.slots.length} slots
                    </div>
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
                    banner
                  </span>

                  {/* Order number */}
                  <span style={{ fontSize: 10, color: theme.textSecondary, flexShrink: 0 }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Dots menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : banner.id);
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
                      opacity: banner.id === activeId ? 1 : 0.4,
                      transition: 'opacity 0.1s',
                      flexShrink: 0,
                    }}
                  >
                    <MoreVertical size={13} />
                  </button>
                </div>
                {/* Reorder popup */}
                {isMenuOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 20 }}
                      onClick={closeMenu}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '100%', right: 8,
                      zIndex: 30,
                      width: 164,
                      background: theme.bgSecondary,
                      border: `0.5px solid ${theme.border}`,
                      borderRadius: 10,
                      padding: 4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}>
                      
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

