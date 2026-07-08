/**
 * Presentation · Component · MiniBarChart
 * Gráfico de barras horizontal en CSS puro (sin librerías). Estética de marca.
 */

"use client";

interface BarDatum {
  label: string;
  value: number;
}

export function MiniBarChart({ data, unit = "" }: { data: BarDatum[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {data.map((d) => (
        <div key={d.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.85rem",
              marginBottom: 6,
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{d.label}</span>
            <span style={{ fontWeight: 700, color: "var(--accent-neon)" }}>
              {d.value.toLocaleString("es-MX")}
              {unit}
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: "var(--radius-pill)",
              background: "var(--bg-base)",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(d.value / max) * 100}%`,
                background: "var(--gradient-brand)",
                borderRadius: "var(--radius-pill)",
                transition: "width var(--transition-smooth)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
