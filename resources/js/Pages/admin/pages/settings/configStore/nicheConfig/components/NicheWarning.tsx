import React, { useState } from "react";
import { X } from "lucide-react";

interface NicheWarningProps {
  isVisible: boolean;
  onDismiss: (dontShowAgain: boolean) => void;
}

const NicheWarning: React.FC<NicheWarningProps> = ({ isVisible, onDismiss }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      className="animate-slide-down mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm"
      role="alert"
    >
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Niche Configuration</h3>
          <p className="text-sm text-amber-800 mb-3">
            Changing the niche affects what products, layouts, and options are available.
            Choose carefully, as activating a new niche may overwrite current store configurations.
          </p>

          <label className="flex items-center gap-2 text-xs text-amber-700 cursor-pointer hover:text-amber-900">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-600 cursor-pointer"
            />
            <span>Don't show this message again this session</span>
          </label>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onDismiss(dontShowAgain)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Got it
          </button>
          <button
            onClick={() => onDismiss(dontShowAgain)}
            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NicheWarning;
