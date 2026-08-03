/**
 * Molecule · SelectWithAdd
 * Select + link "Agregar opción" debajo (no al lado: en grillas de 3
 * columnas no hay ancho para select+botón en la misma fila sin romperse).
 * Al hacer clic revela un campo inline para crear la opción — se persiste
 * vía `useEditableOptions` y se selecciona al toque.
 */

"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import { useEditableOptions, type EditableOption } from "@ui/hooks/useEditableOptions";

interface SelectWithAddProps {
  storageKey: string;
  builtin: EditableOption[];
  value: string;
  onChange: (value: string) => void;
  addLabel: string;
  addPlaceholder: string;
}

export function SelectWithAdd({ storageKey, builtin, value, onChange, addLabel, addPlaceholder }: SelectWithAddProps) {
  const { options, addOption } = useEditableOptions(storageKey, builtin);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function confirmAdd() {
    if (!draft.trim()) {
      setAdding(false);
      return;
    }
    const created = addOption(draft);
    onChange(created.value);
    setDraft("");
    setAdding(false);
  }

  function cancelAdd() {
    setDraft("");
    setAdding(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmAdd();
    }
    if (e.key === "Escape") {
      cancelAdd();
    }
  }

  return (
    <div className="select-with-add">
      <select
        className="ui-input addpart-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {adding ? (
        <div className="select-with-add__row">
          <input
            className="ui-input select-with-add__draft"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={addPlaceholder}
          />
          <button type="button" className="select-with-add__iconBtn" onClick={confirmAdd} aria-label={addLabel}>
            <Check size={14} strokeWidth={2.5} aria-hidden />
          </button>
          <button type="button" className="select-with-add__iconBtn" onClick={cancelAdd} aria-label="Cancelar">
            <X size={14} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      ) : (
        <button type="button" className="select-with-add__link" onClick={() => setAdding(true)}>
          <Plus size={13} strokeWidth={2.5} aria-hidden />
          {addLabel}
        </button>
      )}
    </div>
  );
}
