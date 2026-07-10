/**
 * Hook · useModalA11y
 * Accesibilidad común para modales/popups: cierra con Escape, atrapa el foco
 * (Tab/Shift+Tab) dentro del contenedor, lo enfoca al abrir y devuelve el foco
 * al elemento que lo abrió al cerrarse. Usar en el panel del modal (no en el
 * overlay): `const ref = useModalA11y<HTMLDivElement>(onClose);`.
 */

"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

export function useModalA11y<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = ref.current;
    node?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;

      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
