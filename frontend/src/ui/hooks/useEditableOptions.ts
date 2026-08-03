/**
 * Hook · useEditableOptions
 * Lista de opciones de un <select> con "agregar nueva" persistido en
 * localStorage. Liviano a propósito: sin backend, sin store global — solo
 * lo que un select necesita para poder crecer desde el propio formulario.
 */

"use client";

import { useEffect, useState } from "react";

export interface EditableOption {
  value: string;
  label: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useEditableOptions(storageKey: string, builtin: EditableOption[]) {
  const [custom, setCustom] = useState<EditableOption[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setCustom(JSON.parse(raw) as EditableOption[]);
    } catch {
      // localStorage no disponible (SSR/privado) — se queda sin opciones custom.
    }
  }, [storageKey]);

  function addOption(label: string): EditableOption {
    const trimmed = label.trim();
    const value = slugify(trimmed) || `custom-${Date.now()}`;
    const option: EditableOption = { value, label: trimmed };

    setCustom((prev) => {
      if (builtin.some((o) => o.value === value) || prev.some((o) => o.value === value)) {
        return prev;
      }
      const next = [...prev, option];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });

    return option;
  }

  return { options: [...builtin, ...custom], addOption };
}
