import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contextHooks/useTheme";

export function ThemeToggle() {
  const { themeMode: currentThemeMode, dispatch } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch({type : "SET_THEME_MODE"  , payload : currentThemeMode == 'dark' ? "light" : 'dark'})}
      data-testid="button-theme-toggle"
      className="h-9 w-9"
    >
      {currentThemeMode === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
