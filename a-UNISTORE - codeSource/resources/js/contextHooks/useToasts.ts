import { ToastContext } from "@/context/ToastContext";
import { useContext } from "react";





export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
