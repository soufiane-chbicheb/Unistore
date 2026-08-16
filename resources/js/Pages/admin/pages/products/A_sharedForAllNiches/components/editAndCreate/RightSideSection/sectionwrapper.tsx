import { useState, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';
import { CollapsibleButton } from './collapsiblebutton';

interface SectionWrapperProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SectionWrapper({
  title,
  icon: Icon,
  children,
  defaultOpen = true
}: SectionWrapperProps) {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundColor: currentTheme.card,
        borderRadius: currentTheme.borderRadius,
        border: `1px solid ${currentTheme.border}`,
        boxShadow: currentTheme.shadow,
      }}
    >
      <div className="h-12">
        <CollapsibleButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          ariaExpanded={isOpen}
          ariaControls={sectionId}
        >
          <Icon
            className="w-5 h-5 flex-shrink-0"
            style={{ color: currentTheme.textSecondary }}
          />
          <h3
            className="text-sm font-semibold"
            style={{ color: currentTheme.text }}
          >
            {title}
          </h3>
        </CollapsibleButton>
      </div>

      <div
        id={sectionId}
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div
          className="px-4 py-4 space-y-4"
          style={{ borderTop: `1px solid ${currentTheme.border}` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

