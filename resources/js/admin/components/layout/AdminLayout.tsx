import { ReactNode, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import { AuthProvider } from "@/admin/context/AuthContext";
import { Sidebar } from "./SideBar";
import { AdminThemeProvider } from "@/contextProvoders/AdminThemeProvider";
import { useTheme } from "@/contextHooks/useTheme";
import { ToastProvider } from "@/contextProvoders/ToastProvider";

export function AdminLayout({ children }: { children: ReactNode }) {

  return<>
        <AuthProvider>
            <AdminLayoutContent children={children} />
        </AuthProvider>
  </>
}


const AdminLayoutContent = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useAuth();
  const { theme: currentTheme } = useTheme();
  
  // Initialize collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  }); 

  // Map theme colors to CSS variables for Shadcn/UI components
  const themeStyles = {
    '--background': currentTheme.bg,
    '--foreground': currentTheme.text,
    '--card': currentTheme.card,
    '--card-foreground': currentTheme.text,
    '--popover': currentTheme.modal,
    '--popover-foreground': currentTheme.text,
    '--primary': currentTheme.primary,
    '--primary-foreground': currentTheme.textInverse,
    '--secondary': currentTheme.secondary,
    '--secondary-foreground': currentTheme.text,
    '--muted': currentTheme.bgSecondary,
    '--muted-foreground': currentTheme.textMuted,
    '--accent': currentTheme.accent,
    '--accent-foreground': currentTheme.textInverse,
    '--destructive': currentTheme.error,
    '--destructive-foreground': currentTheme.textInverse,
    '--border': currentTheme.border,
    '--input': currentTheme.border,
    '--ring': currentTheme.accent,
  } as React.CSSProperties;

  return (
    <div className="flex h-dvh overflow-hidden" style={themeStyles}>

      {/* ← dynamic width instead of hardcoded w-64 */}
      <div style={{
        width: collapsed ? '72px' : '256px',
        minWidth: collapsed ? '72px' : '256px',
        flexShrink: 0,
        height: '100%',
        transition: 'width 0.3s ease, min-width 0.3s ease',
      }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-auto"
          style={{ color: currentTheme.text, background: currentTheme.bgSecondary }}
        >
          {children}
        </main>
      </div>

    </div>
  );
};
