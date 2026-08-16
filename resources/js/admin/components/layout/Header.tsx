import { Bell, User, LogOut } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/helpers";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contextHooks/useTheme";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export function Header({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const { admin } = useAuth();
  const { theme: currentTheme } = useTheme();
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const logout = () => {
     router.get(route('logout'))
  }
  return (
    <nav 
    style={{
      backgroundColor : `${currentTheme.bg} !important`, 
      color : `${currentTheme.text} !important`,
      borderBottom: `1px solid ${currentTheme.border} !important`
    }}
    className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 px-6">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleSidebar}
            style={{ color: currentTheme.text }}
          >
          ☰
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-notifications"
          className="h-9 w-9"
          style={{ color: currentTheme.text }}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2"
              data-testid="button-admin-menu"
              style={{ color: currentTheme.text }}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs" style={{ background: currentTheme.accent, color: currentTheme.textInverse }}>
                  {admin ? getInitials(admin.name) : "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {admin?.name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56"
            style={{ 
              backgroundColor: currentTheme.card, 
              color: currentTheme.text,
              borderColor: currentTheme.border 
            }}
          >
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium" style={{ color: currentTheme.text }}>{admin?.name}</p>
                <p className="text-xs" style={{ color: currentTheme.textMuted }}>{admin?.email}</p>
                <p className="text-xs capitalize" style={{ color: currentTheme.textSecondary }}>
                  {admin?.role?.replace("_", " ")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ backgroundColor: currentTheme.border }} />
            <DropdownMenuItem 
              data-testid="menu-item-profile"
              style={{ color: currentTheme.text }}
              className="hover:bg-accent/10"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ backgroundColor: currentTheme.border }} />
            <DropdownMenuItem
              onClick={logout}
              data-testid="menu-item-logout"
              style={{ color: currentTheme.error }}
              className="focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
