import { ToastViewport } from "@/components/ui/ToastViewPort";
import { ToastContext } from "@/context/ToastContext";
import {  useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as ToastPrimitives from "@radix-ui/react-toast"

export interface ToastType {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: "success" | "error" | "info";
  duration?: number;
}

export interface ToastInternal extends Required<Omit<ToastType, "action" | "id">> {
  id: string;
  action?: React.ReactNode;
  leaving: boolean;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 400);
  }, []);

  const addToast = useCallback(
    (toast: ToastType) => {
      const id = toast.id ?? Math.random().toString(36).slice(2);
      const t: ToastInternal = {
        id,
        title: toast.title ?? "",
        description: toast.description ?? "",
        type: toast.type ?? "info",
        duration: toast.duration ?? 4500,
        action: toast.action,
        leaving: false,
      };
      setToasts((prev) => [...prev, t]);
      if (t.duration > 0) setTimeout(() => removeToast(id), t.duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastPrimitives.Provider>
        {children}
        <ToastViewport toasts={toasts} onRemove={removeToast} />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}
