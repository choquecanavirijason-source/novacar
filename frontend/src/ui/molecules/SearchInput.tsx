/**
 * Molecule · SearchInput
 * Input de búsqueda con icono. Controlado.
 */

"use client";

import { Input } from "../atoms/Input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
}

export function SearchInput({ value, onChange, placeholder, ...aria }: SearchInputProps) {
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
        }}
      >
        🔍
      </span>
      <Input
        pill
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft: 42, width: "100%" }}
        {...aria}
      />
    </div>
  );
}
