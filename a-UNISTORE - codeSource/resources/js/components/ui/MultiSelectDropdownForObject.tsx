import { Check, ChevronDown, Trash2 } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { isObject } from "lodash";
import { useTheme } from "@/contextHooks/useTheme";

export type AllowedObjectsType = { value: string | number; label: string };

interface MultiSelectDropdownForObjectProps {
  label?: string;
  options?: AllowedObjectsType[];
  selectedValues?: AllowedObjectsType[];
  onChange: (selected: AllowedObjectsType[]) => void;
  multiple?: boolean;
  onOpenState? : () => void
}

const MultiSelectDropdownForObject: React.FC<MultiSelectDropdownForObjectProps> = ({
  label = 'option',
  options = [],
  selectedValues = [],
  onChange,
  multiple = true,
  onOpenState
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { theme: currentTheme } = useTheme();

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
  
    setIsOpen(prev => !prev);
    
  };

  useEffect(() => {
    if(!isOpen) return ; 
    onOpenState?.()
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (containerRef.current?.contains(e.target as HTMLElement)) return;
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const toggleOption = (option: AllowedObjectsType) => {
    if (!isObject(option)) return;

    if (multiple) {
      const exists = selectedValues.some(v => v.value === option.value);
      const next = exists
        ? selectedValues.filter(v => v.value !== option.value)
        : [...selectedValues, option];
      onChange(next);
    } else {
      const alreadySelected = selectedValues.some(v => v.value === option.value);
      onChange(alreadySelected ? [] : [option]);
      setIsOpen(false);
    }
  };

  const triggerLabel = () => {
    if (selectedValues.length === 0) return `Select ${label.toLowerCase()}`;
    if (!multiple) return selectedValues[0]?.label ?? `Select ${label.toLowerCase()}`;
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="w-full px-3 py-2 text-sm flex items-center justify-between transition-colors focus:outline-none"
        style={{
          backgroundColor: currentTheme.bgSecondary,
          border: `1px solid ${isOpen ? currentTheme.accent : currentTheme.border}`,
          borderRadius: currentTheme.borderRadius,
          color: selectedValues.length === 0 ? '#9ca3af' : currentTheme.text,
        }}
      >
        <span className="capitalize">{triggerLabel()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: currentTheme.text }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && rect && (
        <div
          className="overflow-y-auto shadow-lg themed-scroll"
          style={{
            position: "fixed",
            top: rect.bottom + 2,
            left: rect.left,
            width: rect.width,
            maxHeight: "220px",
            backgroundColor: currentTheme.bgSecondary,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: currentTheme.borderRadius,
            zIndex: 99999,
            "--scroll-color": currentTheme.primary,
          } as CSSProperties}
        >
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm" style={{ color: '#9ca3af' }}>
              No options available
            </div>
          )}
          {options.map(option => {
            const isSelected = selectedValues.some(v => v.value === option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option)}
                className="w-full px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: isSelected ? `${currentTheme.accent}18` : "transparent",
                  color: currentTheme.text,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${currentTheme.accent}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = isSelected
                    ? `${currentTheme.accent}18`
                    : "transparent";
                }}
              >
                {/* Square checkbox for multi, circle radio for single */}
                <div
                  className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: isSelected ? currentTheme.accent : "transparent",
                    border: `1.5px solid ${isSelected ? currentTheme.accent : currentTheme.border}`,
                    borderRadius: multiple ? '4px' : '50%',
                  }}
                >
                  {isSelected && (
                    multiple
                      ? <Check className="w-2.5 h-2.5 text-white" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className="capitalize">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected list — only in multi mode */}
      {multiple && selectedValues.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {selectedValues.map(item => (
            <div
              key={item.value}
              className="w-full flex items-center justify-between px-3 py-2 text-sm"
              style={{
                backgroundColor: `${currentTheme.accent}12`,
                border: `1px solid ${currentTheme.accent}40`,
                borderRadius: currentTheme.borderRadius,
                color: currentTheme.text,
              }}
            >
              <span className="capitalize">{item.label}</span>
              <button
                type="button"
                onClick={() => toggleOption(item)}
                className="hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.error ?? '#ef4444' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdownForObject;
