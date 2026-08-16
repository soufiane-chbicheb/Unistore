import { ThemeMode, ThemePalette, ThemeStyle } from "@/types/ThemeTypes";
import { createContext } from "react";

export interface AdminThemeType {
  currentThemeStyle: ThemeStyle;
  currentThemeMode: ThemeMode;
  currentTheme: ThemePalette;
}

export type AdminThemeAction =
  | { type: "SET_THEME_MODE"; payload: ThemeMode }
  | { type: "SET_THEME_STYLE"; payload: ThemeStyle };

interface AdminThemeContextType {
  state: AdminThemeType;
  dispatch: React.Dispatch<AdminThemeAction>;
}

export const AdminThemeContext = createContext<AdminThemeContextType | null>(null);
