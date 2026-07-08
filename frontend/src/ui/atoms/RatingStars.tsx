/**
 * Atom · RatingStars
 * Muestra una calificación 0–5 con estrellas (★/☆) y, opcionalmente, el conteo.
 */

interface RatingStarsProps {
  value: number;
  reviews?: number;
  size?: string;
}

export function RatingStars({ value, reviews, size = "0.85rem" }: RatingStarsProps) {
  const full = Math.round(value);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: size }}>
      <span style={{ color: "var(--warning)", letterSpacing: "1px" }} aria-hidden>
        {"★".repeat(full)}
        <span style={{ color: "var(--text-muted)" }}>{"★".repeat(5 - full)}</span>
      </span>
      <span style={{ color: "var(--text-secondary)" }}>
        {value.toFixed(1)}
        {reviews != null && <span style={{ color: "var(--text-muted)" }}> ({reviews})</span>}
      </span>
    </span>
  );
}
