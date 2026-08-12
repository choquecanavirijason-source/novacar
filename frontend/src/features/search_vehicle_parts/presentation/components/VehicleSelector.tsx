/**
 * Presentation · Component · VehicleSelector
 * Desplegable (marca / modelo / año): evita que crezca en tarjetas sueltas a
 * medida que el admin agrega más marcas/modelos al catálogo. "Tonto"
 * (presentational): recibe datos y callbacks, no conoce el store.
 */

"use client";

interface VehicleSelectorProps<T extends string | number> {
  options: T[];
  selected: T | null;
  onSelect: (value: T) => void;
  placeholder?: string;
  emptyLabel?: string;
}

export function VehicleSelector<T extends string | number>({
  options,
  selected,
  onSelect,
  placeholder = "Selecciona una opción",
  emptyLabel = "No hay opciones disponibles.",
}: VehicleSelectorProps<T>) {
  if (options.length === 0) {
    return <p className="empty">{emptyLabel}</p>;
  }

  return (
    <select
      className="wizard-select"
      value={selected ?? ""}
      onChange={(e) => onSelect((typeof options[0] === "number" ? Number(e.target.value) : e.target.value) as T)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={String(option)} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
