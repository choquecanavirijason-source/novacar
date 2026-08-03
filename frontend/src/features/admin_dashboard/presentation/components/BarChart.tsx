/**
 * Presentation · Component · BarChart
 * Gráfico de barras verticales (magnitud por categoría, una sola serie):
 * SVG puro, tope redondeado 4px, gridlines hairline, etiqueta directa por
 * barra (n es chico, <=6) y tooltip por barra al hover/focus.
 *
 * El viewBox usa el ancho medido en píxeles reales (no 0–100 estirado): con
 * `preserveAspectRatio="none"` y un viewBox no proporcional al render, el
 * texto y los arcos de las esquinas se deforman horizontalmente. Al fijar
 * el viewBox al ancho real del contenedor, la escala queda 1:1 en ambos ejes.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface BarDatum {
  label: string;
  value: number;
}

const HEIGHT = 200;
const BAR_MAX_WIDTH = 76;
const PADDING_TOP = 30; // deja aire para la etiqueta directa
const PADDING_BOTTOM = 28; // eje + labels de categoría
const BASELINE = HEIGHT - PADDING_BOTTOM;

/** Redondea el techo de una serie de valores a un número "limpio" para gridlines. */
function niceMax(max: number): number {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export function BarChart({ data, unit = "" }: { data: BarDatum[]; unit?: string }) {
  const [containerRef, available] = useMeasuredWidth<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const gridSteps = [0, 0.5, 1].map((f) => Math.round(max * f));

  // El gráfico ocupa todo el ancho disponible de la tarjeta (no lo capamos):
  // con pocas categorías el slot es más ancho y la barra crece hasta
  // BAR_MAX_WIDTH, así 2-3 barras se ven con peso propio en vez de perdidas
  // en una tarjeta que no llenan.
  const W = available;
  const slotWidth = data.length > 0 ? W / data.length : 0;
  const barWidth = Math.min(BAR_MAX_WIDTH, slotWidth * 0.5);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {W > 0 && (
        <svg
          viewBox={`0 0 ${W} ${HEIGHT}`}
          width={W}
          height={HEIGHT}
          role="img"
          aria-label={data.map((d) => `${d.label}: ${d.value}${unit}`).join(", ")}
        >
          {/* Gridlines hairline (recessive) */}
          {gridSteps.map((g) => {
            const y = BASELINE - (g / max) * (BASELINE - PADDING_TOP);
            return (
              <line key={g} x1={0} x2={W} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
            );
          })}

          {data.map((d, i) => {
            const h = (d.value / max) * (BASELINE - PADDING_TOP);
            const x = i * slotWidth + (slotWidth - barWidth) / 2;
            const y = BASELINE - h;
            const r = Math.min(4, h); // no over-round barras muy cortas
            const isHover = hovered === i;

            return (
              <g
                key={d.label}
                tabIndex={0}
                role="button"
                aria-label={`${d.label}: ${d.value}${unit}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{ cursor: "pointer", outline: "none" }}
              >
                {/* hit area más grande que la barra */}
                <rect x={x - 2} y={PADDING_TOP} width={barWidth + 4} height={BASELINE - PADDING_TOP} fill="transparent" />

                <path
                  d={`M ${x} ${BASELINE}
                      L ${x} ${y + r}
                      Q ${x} ${y} ${x + r} ${y}
                      L ${x + barWidth - r} ${y}
                      Q ${x + barWidth} ${y} ${x + barWidth} ${y + r}
                      L ${x + barWidth} ${BASELINE}
                      Z`}
                  fill={isHover ? "var(--accent-neon)" : "var(--primary-glow)"}
                  opacity={isHover ? 1 : 0.88}
                  style={{ transition: "opacity 120ms ease" }}
                />

                {/* etiqueta directa: valor sobre la barra */}
                <text x={x + barWidth / 2} y={y - 9} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--text-primary)">
                  {d.value}
                </text>

                {/* categoría bajo el eje */}
                <text x={x + barWidth / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={12} fill="var(--text-muted)">
                  {d.label.length > 12 ? `${d.label.slice(0, 11)}…` : d.label}
                </text>
              </g>
            );
          })}

          {/* eje base */}
          <line x1={0} x2={W} y1={BASELINE} y2={BASELINE} stroke="var(--border-strong)" strokeWidth={1} />
        </svg>
      )}

      {hovered !== null && (
        <div className="admin-chart-tooltip" style={{ left: `${(hovered + 0.5) * slotWidth}px` }} aria-hidden>
          <strong>
            {data[hovered].value}
            {unit}
          </strong>
          <span>{data[hovered].label}</span>
        </div>
      )}
    </div>
  );
}
