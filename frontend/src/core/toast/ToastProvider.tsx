/**
 * Core · Toast · ToastProvider
 * Notificaciones no bloqueantes (éxito/error/info) con auto-dismiss. Premium
 * Dark UI: glass panel, acento de color por tipo, entrada/salida animada.
 * Uso: const toast = useToast(); toast.success("Guardado"); toast.error(...);
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICON: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string, durationMs = 4000) => {
      const id = ++idRef.current;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message, durationMs) => show("success", message, durationMs),
      error: (message, durationMs) => show("error", message, durationMs),
      info: (message, durationMs) => show("info", message, durationMs),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = ICON[toast.type];
          return (
            <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
              <Icon size={18} strokeWidth={2} aria-hidden />
              <span className="toast__message">{toast.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar"
              >
                <X size={14} strokeWidth={2} aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  return ctx;
}
