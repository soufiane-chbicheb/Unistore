import { ThemePalette } from "@/types/ThemeTypes";

export const getSkeletonColors = (
  theme: ThemePalette,
  mode: "light" | "dark"
) => {
  const isDark = mode === "dark";
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Use theme's actual text colors at varying opacities for skeleton effect
  // This makes the skeleton adapt to each theme's color personality
  
  // Cards have subtle theme tint
  const card = isDark
    ? hexToRgba(theme.textSecondary, 0.1)
    : hexToRgba(theme.text, 0.06);

  // Images use a more visible theme-tinted placeholder
  const image = isDark
    ? hexToRgba(theme.textSecondary, 0.15)
    : hexToRgba(theme.text, 0.1);

  // Text skeleton lines reflect theme text colors
  const lineStrong = isDark
    ? hexToRgba(theme.text, 0.2)
    : hexToRgba(theme.text, 0.15);

  const lineSoft = isDark
    ? hexToRgba(theme.textSecondary, 0.15)
    : hexToRgba(theme.textSecondary, 0.12);

  // Border adapts to theme
  const border = theme.border || (isDark
    ? hexToRgba(theme.textSecondary, 0.2)
    : hexToRgba(theme.text, 0.12));

  // Icon color uses theme text at medium opacity
  const iconColor = isDark
    ? hexToRgba(theme.textSecondary, 0.3)
    : hexToRgba(theme.textSecondary, 0.4);

  return {
    // Base backgrounds directly from theme
    page: theme.bg,
    surface: theme.bgSecondary,
    shadow: theme.shadow,
    radius: theme.borderRadius,

    // Skeleton elements with theme personality
    card,
    image,
    lineStrong,
    lineSoft,
    border,
    iconColor,

    // Stronger accent presence for theme identity
    accentRail: hexToRgba(theme.accent, 0.4),
    accentIconTint: hexToRgba(theme.accent, 0.15),
    
    // Additional accent variations for richer theming
    accentSubtle: hexToRgba(theme.accent, 0.08),
    accentMedium: hexToRgba(theme.accent, 0.2),
  };
};