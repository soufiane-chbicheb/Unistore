import { ThemePalette } from '@/types/ThemeTypes';
import type { CSSProperties } from 'react';

/** Pill badge for 'banner' vs 'collection' type labels */
export function typePill(
  variant: 'banner' | 'collection',
  theme: ThemePalette,
): CSSProperties {
  const isBanner = variant === 'banner';
  return {
    fontSize: '9.5px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    padding: '2px 6px',
    borderRadius: 3,
    flexShrink: 0,
    backgroundColor: isBanner
      ? `${theme.info}22`
      : `${theme.success}22`,
    color: isBanner ? theme.info : theme.success,
  };
}