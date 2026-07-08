/**
 * Presentation · Component · SearchBarPredictive
 * Input con sugerencias filtradas en cliente (búsqueda predictiva).
 * Reutilizable en cualquier paso que tenga muchas opciones (ej. marcas/modelos).
 */

"use client";

import { useMemo, useState } from "react";
import { normalizeText } from "@core/format/formatters";

interface SearchBarPredictiveProps {
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
}

export function SearchBarPredictive({
  options,
  placeholder = "Escribe para filtrar…",
  onSelect,
}: SearchBarPredictiveProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return options.slice(0, 6);
    return options.filter((o) => normalizeText(o).includes(q)).slice(0, 6);
  }, [query, options]);

  const handleSelect = (value: string) => {
    setQuery(value);
    setOpen(false);
    onSelect(value);
  };

  return (
    <div className="predictive">
      <input
        className="predictive__input"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label={placeholder}
      />
      {open && matches.length > 0 && (
        <div className="predictive__list" role="listbox">
          {matches.map((m) => (
            <button
              key={m}
              type="button"
              role="option"
              aria-selected={false}
              className="predictive__item"
              onClick={() => handleSelect(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
