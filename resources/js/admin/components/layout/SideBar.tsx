import { menuItems } from '@/admin/data/adminNavigationsLinks';
import { useTheme } from '@/contextHooks/useTheme';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu as MenuIcon,
  MoreVertical,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Types
interface SubLink {
  title: string;
  href: string;
  icon: typeof Home;
  disabled?: boolean;
}

interface MenuItem {
  title: string;
  icon: typeof Home;
  href?: string;
  badge?: string | number;
  badgeColor?: string;
  subLinks?: SubLink[];
  section?: boolean;
  sectionTitle?: string;
}


// Color Palette

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const { url } = usePage();
  const { theme: currentTheme } = useTheme();

  // Initialize expanded item from localStorage or current URL
  const [expandedItem, setExpandedItem] = useState<string | null>(() => {
    const saved = localStorage.getItem('sidebar_expanded_item');
    if (saved) return saved;

    // Fallback: Find which parent has an active child based on the URL
    const activeParent = menuItems.find(item => 
      item.subLinks?.some(sub => sub.href && route().current(sub.href))
    );
    return activeParent ? activeParent.title : 'Dashboard';
  });

  // Save expanded item to localStorage
  useEffect(() => {
    if (expandedItem) {
      localStorage.setItem('sidebar_expanded_item', expandedItem);
    }
  }, [expandedItem]);

  // Ensure the correct section is expanded when the URL changes
  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.subLinks?.some(sub => sub.href && route().current(sub.href))
    );
    if (activeParent && activeParent.title !== expandedItem) {
      setExpandedItem(activeParent.title);
    }
  }, [url]);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleExpanded = (itemTitle: string) => {
    if (expandedItem === itemTitle) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemTitle);
    }
  };
  
  

  return (
    <div
      style={{
        backgroundColor: currentTheme.sidebarBg,
        color: currentTheme.sidebarFg,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${currentTheme.sidebarBorder}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: collapsed ? '80px' : '256px',
        overflow: 'hidden',
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${currentTheme.sidebarBorder}`,
          backgroundColor: currentTheme.sidebarBg,
        }}
      >
        {!collapsed && (
          <div
            style={{
              color: currentTheme.sidebarFg,
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '-0.025em',
            }}
          >
            Ecom
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              color: currentTheme.sidebarMutedFg,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.2s',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = currentTheme.sidebarFg;
              e.currentTarget.style.backgroundColor = currentTheme.sidebarHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = currentTheme.sidebarMutedFg;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {!collapsed && (
            <>
              <button
                title="Toggle menu"
                style={{
                  color: currentTheme.sidebarMutedFg,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.sidebarFg;
                  e.currentTarget.style.backgroundColor = currentTheme.sidebarHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.sidebarMutedFg;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MenuIcon size={20} />
              </button>
              <button
                title="More options"
                style={{
                  color: currentTheme.sidebarMutedFg,
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.sidebarFg;
                  e.currentTarget.style.backgroundColor = currentTheme.sidebarHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.sidebarMutedFg;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MoreVertical size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div
        className="sidebar-scroll"
        style={{
        
          flex: 1,
          overflowY: 'auto',
          paddingTop: '1rem',
          paddingBottom: '1rem',
         
        }}
      >
        <nav style={{ paddingBlock: '0 0.75rem' }}>
          {menuItems.map((item, index) => {
            // Section Header
            if (item.section) {
              return (
                <div
                  key={`section-${index}`}
                  style={{
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
                    marginTop: index > 0 ? '1rem' : '0',
                  }}
                >
                  {!collapsed && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            height: '1px',
                            flex: 1,
                            backgroundColor: currentTheme.sidebarBorder,
                          }}
                        />
                      </div>
                      <h4
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: currentTheme.sidebarMutedFg,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        {item.sectionTitle}
                      </h4>
                    </>
                  )}
                  {collapsed && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: currentTheme.sidebarMuted,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            const isExpanded = expandedItem === item.title;
            const hasActiveChild = item.subLinks?.some((sub) => sub.href === url);

            return (
              <div
                key={item.title}
                style={{
                   

                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  backgroundColor: isExpanded && !collapsed ? `${currentTheme.sidebarHover}80` : 'transparent',
                  marginBottom: '0.25rem',
                 
                }}
              >
                <button
                  onClick={() => {
                    if (item.subLinks) {
                      toggleExpanded(item.title);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                 
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor:
                      isExpanded || hasActiveChild
                        ? currentTheme.sidebarActive
                        : 'transparent',
                    color:
                      isExpanded || hasActiveChild
                        ? currentTheme.sidebarActiveFg
                        : currentTheme.sidebarFg,
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded && !hasActiveChild) {
                      e.currentTarget.style.backgroundColor = currentTheme.sidebarHover;
                      e.currentTarget.style.color = currentTheme.sidebarFg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded && !hasActiveChild) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = currentTheme.sidebarFg;
                    }
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: isExpanded || hasActiveChild ? 'scale(1.1)' : 'scale(1)',
                      }}
                    />
                    {!collapsed && (
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexShrink: 0,
                      }}
                    >
                      {item.badge && (
                        <span
                          style={{
                            backgroundColor: item.badgeColor || currentTheme.accent,
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 500,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.subLinks && (
                        <ChevronDown
                          size={16}
                          style={{
                            transition: 'transform 0.3s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub  links */}
                {item.subLinks && isExpanded && !collapsed && (
                  <div
                    style={{
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      animation: 'fadeIn 0.3s ease-out',
                    }}
                  >
                    {item.subLinks.map((subLink, subIndex) => {
                          const SubIcon = subLink.icon;
                          const isSubActive = subLink.href ? route().current(subLink.href) : false;
                          const isDisabled = !subLink.href || subLink.disabled;  

                          return (
                            <Link
                              key={`${subLink.title}-${subIndex}`}            
                              href={isDisabled ? '#' : route(subLink.href)}  
                                                
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 16px 8px 42px',
                            fontSize: '0.825rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background 0.15s',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isDisabled ? 0.4 : 1,
                            backgroundColor: isSubActive ? currentTheme.sidebarActive : 'transparent',
                            color: isSubActive ? currentTheme.sidebarActiveFg : currentTheme.sidebarMutedFg,
                            borderLeft: `2px solid ${isSubActive ? currentTheme.sidebarActiveFg : 'transparent'}`,
                            animationDelay: `${subIndex * 30}ms`,
                            marginBottom: '0.25rem',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive && !isDisabled) {
                              e.currentTarget.style.backgroundColor = currentTheme.sidebarHover;
                              e.currentTarget.style.color = currentTheme.sidebarFg;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive && !isDisabled) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = currentTheme.sidebarMutedFg;
                            }
                          }}
                        >
                          <SubIcon
                            size={16}
                            style={{
                              flexShrink: 0,
                              transition: 'transform 0.2s',
                              transform: isSubActive ? 'scale(1.1)' : 'scale(1)',
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {subLink.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .sidebar-scroll::-webkit-scrollbar {
            width: 4px;
          }
          
          .sidebar-scroll::-webkit-scrollbar-track {
            background: ${currentTheme.sidebarBg};
          }
          
          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: ${currentTheme.sidebarMuted};
            border-radius: 2px;
          }
          
          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.sidebarMutedFg};
          }
        `}
      </style>
    </div>
  );
}
