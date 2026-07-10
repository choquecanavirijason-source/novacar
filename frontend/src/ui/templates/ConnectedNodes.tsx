/**
 * Template · ConnectedNodes
 * Alternativa a FeatureGrid: en vez de tarjetas o círculos flotando, los
 * indicadores (nodos dorados con ícono lineal en negro) quedan unidos por
 * una línea horizontal fina con pequeños rombos de control entre cada par.
 * El texto (título mayúsculas + descripción gris) queda centrado bajo cada
 * nodo. En mobile la línea se oculta y los nodos pasan a wrap en 2 columnas.
 */

import type { ReactNode } from "react";

export interface NodeItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ConnectedNodes({ items }: { items: NodeItem[] }) {
  const stops = Math.max(items.length - 1, 0);

  return (
    <div className="node-track">
      <div className="node-track__line" aria-hidden>
        {Array.from({ length: stops }).map((_, i) => (
          <span
            key={i}
            className="node-track__stop"
            style={{ left: `${((i + 0.5) / stops) * 100}%` }}
          />
        ))}
      </div>

      <div className="node-track__items">
        {items.map((item, i) => (
          <div key={i} className="node-track__item" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="node-track__node">{item.icon}</span>
            <h3 className="node-track__title">{item.title}</h3>
            <p className="node-track__desc">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
