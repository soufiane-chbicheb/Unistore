import { X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function UnsavedChangesToast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed top-0 left-0 z-50 animate-slide-in w-full">
      <div className="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 min-w-[300px]">
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="hover:bg-orange-600 rounded p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
