/**
 * Presentation · Component · BrandTicker
 * Franja horizontal debajo del Hero con las marcas disponibles en el
 * catálogo, en scroll continuo (marquee). Placeholder tipográfico — se
 * reemplaza por logos reales cuando existan los assets.
 */

"use client";

import "../styles/brand-ticker.css";

const BRANDS = [
  "Nissan",
  "Volkswagen",
  "Toyota",
  "Tesla",
  "Honda",
  "BMW",
  "Mazda",
  "Chevrolet",
  "Ford",
  "Hyundai",
  "Kia",
];

export function BrandTicker() {
  return (
    <div className="brand-ticker" aria-label="Marcas disponibles">
      <div className="brand-ticker__track">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span key={i} className="brand-ticker__item">
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}