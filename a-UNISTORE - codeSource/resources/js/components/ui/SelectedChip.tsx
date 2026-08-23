 import { X } from "lucide-react";
import { useTheme } from "@/contextHooks/useTheme";

interface SelectedChipProps {
  label: string;
  onRemove: () => void;
  removable?: boolean;
}
const SelectedChip: React.FC<SelectedChipProps> = ({ label, onRemove, removable = true }) => {
  const { theme: currentTheme } = useTheme();
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
      style={{ 
        backgroundColor: currentTheme.primary,
        color: currentTheme.textInverse,
        borderColor: currentTheme.accent
      }}
    >
      {label}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 transition-all duration-200 hover:bg-red-100"
          style={{
            color: '#6b7280'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.error;
            e.currentTarget.style.color = currentTheme.textInverse;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = currentTheme.textInverse;
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};


export default SelectedChip ; 
