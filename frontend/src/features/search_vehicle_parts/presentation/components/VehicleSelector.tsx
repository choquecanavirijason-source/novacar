/**
 * Presentation · Component · VehicleSelector
 * Renderiza un grupo de opciones (marca / modelo / año) como chips seleccionables.
 * Es "tonto" (presentational): recibe datos y callbacks, no conoce el store.
 */

"use client";

interface VehicleSelectorProps<T extends string | number> {
  options: T[];
  selected: T | null;
  onSelect: (value: T) => void;
  emptyLabel?: string;
}

export function VehicleSelector<T extends string | number>({
  options,
  selected,
  onSelect,
  emptyLabel = "No hay opciones disponibles.",
}: VehicleSelectorProps<T>) {
  if (options.length === 0) {
    return <p className="empty">{emptyLabel}</p>;
  }

  return (
    <div className="option-grid">
      {options.map((option) => (
        <button
          key={String(option)}
          type="button"
          className={`option-chip ${selected === option ? "option-chip--selected" : ""}`}
          onClick={() => onSelect(option)}
          aria-pressed={selected === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
