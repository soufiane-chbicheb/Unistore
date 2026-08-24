import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { ChevronDown, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CollapsibleFriendlySectionProps {
  title: string;
  icon?: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  headerActions?: ReactNode;
  children: ReactNode;
}

function CollapsibleFriendlySection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  headerActions,
  children,
}: CollapsibleFriendlySectionProps) {
  const {
    state: { currentTheme: theme },
  } = useStoreConfigCtx();

  return (
    <div
      className="shadow-sm overflow-hidden"
      style={{
         backgroundColor: isOpen ? theme.card : theme.bg,
        borderWidth: '2px',
        borderColor: theme.border ,
        borderRadius: theme.borderRadius,
        boxShadow: theme.shadow,
      }}
    >
      {/* HEADER */}
      <div className="flex items-stretch transition-colors">
        {/* MAIN CLICK AREA */}
        <div
          className="flex flex-1 items-center justify-between p-5 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                className="w-5 h-5"
                style={{ color: theme.textSecondary }}
              />
            )}
            <h3
              className="font-semibold text-sm uppercase tracking-wide"
              style={{ color: theme.text }}
            >
              {title}
            </h3>
          </div>

          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {headerActions}
          </div>
        </div>

        {/* SWITCHER BUTTON (RIGHT END) */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse section" : "Expand section"}
          className="flex items-center justify-center px-4 transition-all"
          style={{
            borderLeft: `1px solid ${theme.border}`,
          }}
        >
          <ChevronDown
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            style={{ color: theme.textSecondary }}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        <div
          className="p-6 pt-4 space-y-6"
          style={{ color: theme.text }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleFriendlySection;
