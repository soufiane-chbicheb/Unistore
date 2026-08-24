import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface HoverInfoLabelProps {
  htmlFor?: string;
  label: string;
  tooltip: string;
}

export function HoverInfoLabel({ htmlFor, label, tooltip }: HoverInfoLabelProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const TOOLTIP_WIDTH = 256; // w-64 = 16rem = 256px
  const TOOLTIP_OFFSET = 8;

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right - TOOLTIP_OFFSET;
      const goLeft = spaceOnRight < TOOLTIP_WIDTH;

      setCoords({
        top: rect.top + rect.height / 2 + window.scrollY,
        left: goLeft
          ? rect.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET + window.scrollX
          : rect.right + TOOLTIP_OFFSET + window.scrollX,
        flipped: goLeft,
      });
    }
  };

  const handleShow = () => {
    updateCoords();
    setShowTooltip(true);
  };

  const handleHide = () => setShowTooltip(false);

  return (
    <div className="flex items-center gap-2 mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <button 
          ref={buttonRef}
          type="button"
          onMouseEnter={handleShow}
          onMouseLeave={handleHide}
          onFocus={handleShow}
          onBlur={handleHide}
          className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
          aria-label={`Info: ${tooltip}`}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {showTooltip && createPortal(
        <div
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: 'translateY(-50%)',
            zIndex: 99999,
          }}
          className="w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
        >
          {tooltip}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>,
        document.body
      )}
    </div>
  );
}
