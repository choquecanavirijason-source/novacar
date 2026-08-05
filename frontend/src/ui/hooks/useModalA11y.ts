/**
 * Hook · useModalA11y
 * Accesibilidad común para modales/popups: cierra con Escape, atrapa el foco
 * (Tab/Shift+Tab) dentro del contenedor, lo enfoca al abrir y devuelve el foco
 * al elemento que lo abrió al cerrarse. Usar en el panel del modal (no en el
 * overlay): `const ref = useModalA11y<HTMLDivElement>(onClose);`.
 *
 * Implementado con un callback ref (con función de limpieza, React 19) en
 * vez de useEffect + useRef: algunos modales (p.ej. CategoriesBento) viven
 * dentro de un componente que está SIEMPRE montado y solo alternan un estado
 * interno para mostrar el panel — con useEffect([]) la configuración corría
 * una sola vez, con el panel aún sin existir, y nunca se reactivaba al abrir
 * el modal. El callback ref sí se dispara cada vez que el nodo del panel
 * realmente aparece o desaparece del DOM, sin importar ese patrón.
 */

"use client";

import { useCallback, useRef } from "react";
import { startLenis, stopLenis } from "@core/motion/SmoothScroll";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

export function useModalA11y<T extends HTMLElement>(onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const setNode = useCallback((node: T | null) => {
    if (!node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    node.focus();

    // El sitio usa Lenis (scroll suave global, ver SmoothScroll.tsx), que
    // intercepta la rueda del mouse en todo el documento. El atributo
    // data-lenis-prevent no es suficiente en todos los casos (p.ej. con el
    // panel portado a document.body), así que directamente se detiene Lenis
    // mientras el modal está abierto — el scroll nativo del panel
    // (overflow-y: auto) queda libre y el de la página ya está bloqueado
    // aparte (ver más abajo).
    node.setAttribute("data-lenis-prevent", "");
    stopLenis();

    // Al ocultar el scroll de la página, la barra desaparece y el ancho
    // disponible crece — eso "brinca" el layout. Compensamos con padding
    // para que nada se recorra ni se vea cortado.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPaddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
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
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      startLenis();
      previouslyFocused?.focus();
    };
  }, []);

  return setNode;
}
