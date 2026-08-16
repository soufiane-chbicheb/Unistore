import type { BannerSlotElements } from '@/types/homeEditor';
import { ThemePalette } from '@/types/ThemeTypes';

type BannerSlotContentProps = {
  elements: BannerSlotElements;
  theme: ThemePalette;
};

export function BannerSlotContent({ elements, theme }: BannerSlotContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {elements.eyebrow?.visible && (
        <div style={{
          fontSize: 9,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: elements.eyebrow.color ?? theme.banner.scrimSubtext,
        }}>
          {elements.eyebrow.text}
        </div>
      )}
      {elements.title?.visible && (
        <div style={{
          fontSize: 18,
          fontWeight: 500,
          color: elements.title.color ?? theme.banner.solidText,
          lineHeight: 1.2,
        }}>
          {elements.title.text}
        </div>
      )}
      {elements.paragraph?.visible && (
        <div style={{
          fontSize: 12,
          color: elements.paragraph.color ?? theme.banner.solidSubtext,
          lineHeight: 1.45,
        }}>
          {elements.paragraph.text}
        </div>
      )}
      {elements.button?.visible && (
        <button
          style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 11.5,
            fontWeight: 500,
            color: elements.button.text_color ?? theme.banner.accentBtnText,
            background: elements.button.bg_color ?? theme.banner.accentBtn,
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          {elements.button.text}
        </button>
      )}
    </div>
  );
}
