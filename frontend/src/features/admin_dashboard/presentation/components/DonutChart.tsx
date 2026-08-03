/**
 * Presentation · Component · DonutChart
 * Composición categórica (identidad): 3 colores validados (CVD-safe, modo
 * oscuro) vía conic-gradient + leyenda con conteo y porcentaje. El centro
 * muestra el total (hero number del donut).
 */

"use client";

import { useState } from "react";

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ data, unit = "" }: { data: DonutDatum[]; unit?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  let acc = 0;
  const stops = data.map((d) => {
    const from = total > 0 ? (acc / total) * 360 : 0;
    acc += d.value;
    const to = total > 0 ? (acc / total) * 360 : 0;
    return { ...d, from, to };
  });

  const gradient =
    total > 0
      ? stops.map((s) => `${s.color} ${s.from}deg ${s.to}deg`).join(", ")
      : "var(--border) 0deg 360deg";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `conic-gradient(${gradient})`,
            transition: "opacity 150ms ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 34,
            borderRadius: "50%",
            background: "var(--bg-surface)",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1 }}>
              {hovered !== null ? stops[hovered].value : total}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
              {hovered !== null ? stops[hovered].label : `${unit || "total"}`}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, flex: 1, minWidth: 200 }}>
        {stops.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "none",
              border: "none",
              padding: "6px 0",
              cursor: "pointer",
              opacity: hovered === null || hovered === i ? 1 : 0.5,
              transition: "opacity 120ms ease",
            }}
          >
            <span
              aria-hidden
              style={{ width: 13, height: 13, borderRadius: 4, background: s.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: "1rem", color: "var(--text-secondary)", flex: 1, textAlign: "left" }}>
              {s.label}
            </span>
            <strong style={{ fontSize: "1.05rem" }}>{s.value}</strong>
            <span style={{ fontSize: "0.86rem", color: "var(--text-muted)", width: 42, textAlign: "right" }}>
              {total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
