/**
 * Atom · Skeleton
 * Placeholder de carga con animación shimmer.
 */

export function Skeleton({ height = 80, radius }: { height?: number | string; radius?: string }) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: radius ?? "var(--radius-md)", width: "100%" }}
    />
  );
}
