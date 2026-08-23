import { ChevronDown } from 'lucide-react';
import { useAdminThemeCtx } from '@/contextHooks/useAdminThemeCtx';

interface CollapsibleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaExpanded: boolean;
  ariaControls: string;
  children: React.ReactNode;
}

export function CollapsibleButton({
  isOpen,
  onClick,
  ariaExpanded,
  ariaControls,
  children
}: CollapsibleButtonProps) {
  const {
    state: { currentTheme },
  } = useAdminThemeCtx();

  return (
    <button
      type='button'
      onClick={onClick}
      className="w-full h-full px-4 py-3 flex items-center justify-between transition-colors duration-150"
      style={{
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = currentTheme.bgSecondary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      <div className="flex items-center gap-3">
        {children}
      </div>
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`}
        style={{ color: currentTheme.textMuted }}
      />
    </button>
  );
}

