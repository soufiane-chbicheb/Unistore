import * as React from "react"
import { X, CheckCircle2, AlertCircle, Info, LucideIcon } from "lucide-react"
import { ToastInternal } from "@/contextProvoders/ToastProvider"

interface ToastProps {
  toast: ToastInternal;
  onRemove: (id: string) => void;
}

const icons: Record<string, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export const Toast = ({ toast, onRemove }: ToastProps) => {
  const Icon = icons[toast.type] || Info;

  return (
    <div className={`tv-toast ${toast.leaving ? 'tv-leave' : 'tv-enter'}`}>
      <div className="tv-glow" style={{ '--glow': `var(--${toast.type}-glow)` } as any} />
      
      <div className="tv-icon-wrap" style={{ '--accent': `var(--${toast.type})` } as any}>
        <Icon className="tv-icon" />
      </div>

      <div className="tv-content">
        {toast.title && <h4 className="tv-title">{toast.title}</h4>}
        {toast.description && <p className="tv-desc">{toast.description}</p>}
        {toast.action && <div className="tv-action">{toast.action}</div>}
      </div>

      <button className="tv-close" onClick={() => onRemove(toast.id)}>
        <X size={14} />
      </button>

      <div className="tv-bar-track">
        <div 
          className="tv-bar" 
          style={{ 
            '--accent': `var(--${toast.type})`,
            transitionDuration: `${toast.duration}ms`
          } as any} 
        />
      </div>
    </div>
  );
};
