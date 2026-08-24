
import { useTheme } from "@/contextHooks/useTheme";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ===================== PAGINATION COMPONENT =====================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pages: number[]; // directly from backend (Laravel)
  onPageChange: (page: number) => void;
}

export const PaginationSlide = ({
  currentPage,
  totalPages,
  pages,
  onPageChange,
}: PaginationProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="flex items-center justify-center gap-2 py-6"
      style={{ borderTop: `1px solid ${theme.border}` }}
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg font-semibold text-sm min-w-[40px] flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        style={{
          background: theme.bg,
          color: theme.text,
          border: `2px solid ${theme.border}`,
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="px-3 py-2 rounded-lg font-semibold text-sm min-w-[40px] transition-all hover:scale-105"
          style={{
            background:
              page === currentPage
                ? `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`
                : theme.bg,
            color: page === currentPage ? theme.textInverse : theme.text,
            border: `2px solid ${page === currentPage ? theme.accent : theme.border}`,
            boxShadow: page === currentPage ? `0 4px 12px ${theme.accent}40` : "none",
          }}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg font-semibold text-sm min-w-[40px] flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        style={{
          background: theme.bg,
          color: theme.text,
          border: `2px solid ${theme.border}`,
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
