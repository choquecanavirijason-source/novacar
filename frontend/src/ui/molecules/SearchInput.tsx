/**
 * Molecule · SearchInput
 * Input de búsqueda con icono. Controlado, pero con debounce interno: el
 * valor visible responde al instante mientras se escribe, y `onChange` (que
 * suele disparar un fetch) solo se llama tras una pausa sin teclear. Si
 * `value` cambia desde fuera (ej. "Limpiar filtros"), el input se sincroniza
 * de inmediato sin esperar el debounce.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../atoms/Input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Espera (ms) tras dejar de escribir antes de llamar a `onChange`. */
  debounceMs?: number;
  "aria-label"?: string;
}

export function SearchInput({ value, onChange, placeholder, debounceMs = 300, ...aria }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (local === value) return;
    const timer = window.setTimeout(() => onChangeRef.current(local), debounceMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
          display: "inline-flex",
        }}
      >
        <Search size={16} strokeWidth={1.75} />
      </span>
      <Input
        pill
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        style={{ paddingLeft: 42, width: "100%" }}
        {...aria}
      />
    </div>
  );
}
