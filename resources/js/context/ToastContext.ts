import { createContext } from "react";



export interface ToastType {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: "success" | "error" | "info";
  duration?: number; 

}


interface ToastContextValue {
  addToast: (toast: ToastType) => void;
  removeToast: (id: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────

export const ToastContext = createContext<ToastContextValue | null>(null);


