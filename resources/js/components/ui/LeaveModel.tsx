import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ThemePalette } from '@/types/ThemeTypes';

interface LeaveModalProps {
  onLeave: () => void;
  onClose: () => void;
  onSaveDraft: () => void;
  theme: ThemePalette;
}

export default function LeaveModal({ onLeave, onClose, onSaveDraft, theme }: LeaveModalProps) {
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    saveBtnRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: theme.overlay }}
        onClick={onClose}
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-title"
        className="relative w-[440px] max-w-[calc(100vw-2rem)] overflow-hidden"
        style={{
          backgroundColor: theme.modal,
          borderRadius: theme.borderRadius,
          boxShadow: theme.shadowLg,
          border: `1px solid ${theme.border}`,
        }}
      >
        {/* X close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full transition-colors duration-150"
          style={{ color: theme.textMuted }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.bgSecondary)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* body */}
        <div className="px-6 pt-6 pb-4">
          <h2
            id="leave-title"
            className="text-[17px] font-semibold mb-2 pr-8"
            style={{ color: theme.text }}
          >
            Leave without saving?
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: theme.textSecondary }}>
            You have unsaved changes. If you leave now, your progress will be lost.
          </p>
        </div>

        {/* divider */}
        <div style={{ borderTop: `1px solid ${theme.border}` }} />

        {/* actions */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onLeave}
            className="px-5 py-2 text-[14px] font-medium transition-colors duration-150 rounded-full"
            style={{ color: theme.error, backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.bgSecondary)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Leave anyway
          </button>

          <button
            ref={saveBtnRef}
            onClick={onSaveDraft}
            className="px-5 py-2 text-[14px] font-medium transition-colors duration-150 rounded-full"
            style={{ backgroundColor: theme.primary, color: theme.textInverse }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.primaryHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.primary)}
          >
            Save draft & leave
          </button>
        </div>
      </div>
    </div>
  );
}
