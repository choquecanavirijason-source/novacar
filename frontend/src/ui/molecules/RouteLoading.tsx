/**
 * Molecule · RouteLoading
 * Esqueleto genérico (shimmer, sin spinners) para `loading.tsx` de cada ruta:
 * dará feedback instantáneo durante la transición/carga del segmento, antes
 * de que la propia página monte su estado de carga interno (ej. skeletons
 * de CollectionView). Anti-spinner por principio de diseño del proyecto.
 */

import { Skeleton } from "../atoms/Skeleton";

export function RouteLoading() {
  return (
    <div style={{ padding: "40px 0 80px", display: "flex", flexDirection: "column", gap: 28 }} aria-busy="true">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
        <Skeleton height={14} radius="var(--radius-sm)" />
        <Skeleton height={34} radius="var(--radius-sm)" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={280} radius="var(--radius-lg)" />
        ))}
      </div>
    </div>
  );
}
