"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "./Toast";

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "warning" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
 const [toasts, setToasts] = useState<
  Array<{
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>
>([]);

const showToast = useCallback(
  (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    const id = crypto.randomUUID();
    // Alternative (if crypto.randomUUID() isn't available) then const id = `${Date.now()}-${Math.random()}`;

    setToasts((prev) => [
      ...prev,
      { id, message, type },
    ]);
  },
  []
);

const removeToast = useCallback((id: string) => {
  setToasts((prev) =>
    prev.filter((toast) => toast.id !== id)
  );
}, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}