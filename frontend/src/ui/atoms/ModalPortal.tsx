/**
 * Atom · ModalPortal
 * Monta su contenido directo en `document.body`, fuera del árbol de la página.
 * Cualquier ancestro con `transform`/`filter`/`perspective` (animaciones de
 * entrada como IgnitionReveal, ScrollReveal, PageTransition) crea un nuevo
 * containing block y atrapa a los descendientes `position: fixed` — un modal
 * anidado normalmente queda recortado o detrás de otro contenido en vez de
 * flotar sobre toda la página. El portal evita depender de que ningún
 * ancestro, presente o futuro, deje de tener ese efecto secundario.
 */

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
