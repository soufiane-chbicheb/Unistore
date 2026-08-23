import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import type { Section } from '@/types/homeEditor';
import { ScrollRow } from '@/Pages/Home/Partials/ScrollRow';
import BannerRenderer from '../../Banner/Partials/BannerRenderer';
import { ProductSection } from '@/types/HomeFeedTypes';

type PreviewPanelProps = {
  sections: Section[];
  onPublish: () => void;
  onDiscard: () => void;
};

export function PreviewPanel({ sections, onPublish, onDiscard }: PreviewPanelProps) {
  const { state: { currentTheme: theme } } = useAdminThemeCtx();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: theme.bg,
    }}>
      {/* Header */}
      <div
        style={{
          height: 53,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: `1px solid ${theme.border}`,
          background: theme.bgSecondary,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <span style={{
          fontSize: 11,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: theme.textMuted,
        }}>
          Storefront Preview
        </span>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={onDiscard}
            style={{
              fontSize: 12.5,
              fontWeight: 400,
              color: theme.textMuted,
              background: 'none',
              border: `1px solid ${theme.borderHover}`,
              padding: '5px 14px',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Discard
          </button>

          <button
            onClick={onPublish}
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: theme.textInverse,
              background: theme.primary,
              border: 'none',
              padding: '5px 16px',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Sections - Authentic Preview */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: theme.bg,
      }}>
        {sections.map(section => (
          <div 
            key={section.orc_id}
            style={{
               borderBottom: `1px dashed ${theme.borderHover}`,
               position: 'relative',
            }}
          >
             {/* Hint for admin in preview */}
             <div style={{
                position: 'absolute',
                top: 5,
                right: 80,
                fontSize: 9,
                color: theme.textMuted,
                zIndex: 5,
                background: theme.bgSecondary,
                padding: '2px 6px',
                borderRadius: 4,
                opacity: 0.6,
                pointerEvents: 'none',
             }}>
                {section.type.toUpperCase()} - SECTION #{section.order}
             </div>

            {section.type === 'banner'
              ? <BannerRenderer isEditor={false} banner={section.data} />
              : <ScrollRow section={section.data as ProductSection} />
            }
          </div>
        ))}
        
        {/* Fill space at bottom */}
        <div style={{ height: 200 }} />
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

