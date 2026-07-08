/**
 * Template · TileGrid
 * Grid de tiles/categorías con icono + nombre + meta.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";

export interface TileItem {
  id: string;
  icon: ReactNode;
  name: string;
  meta?: string;
  href?: Route | string;
  onClick?: () => void;
}

interface TileGridProps {
  items: TileItem[];
  className?: string;
}

export function TileGrid({ items, className = "" }: TileGridProps) {
  return (
    <div className={`tpl-grid tpl-grid--tiles ${className}`.trim()}>
      {items.map((item, i) => {
        const inner = (
          <>
            <div className="tpl-tile__icon" aria-hidden="true">{item.icon}</div>
            <div>
              <div className="tpl-tile__name">{item.name}</div>
              {item.meta && <div className="tpl-tile__meta">{item.meta}</div>}
            </div>
          </>
        );

        const style = { animationDelay: `${i * 50}ms` };

        if (item.href) {
          return (
            <Link key={item.id} href={item.href as Route} className="tpl-tile" style={style}>
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            className="tpl-tile"
            style={{ ...style, border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            onClick={item.onClick}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}