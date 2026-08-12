/**
 * Presentation · Page · ImportsPage
 * Sección "Importaciones": lista los vehículos disponibles. Dos vistas, como
 * en /catalogo — "Lista" (tarjeta grande tipo Destacados) y "Cuadrícula"
 * (tarjetas compactas). El cliente elige un auto y el CTA abre la
 * cotización automática (mock, ver ImportQuoteModal).
 */

"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { ScrollReveal } from "@ui/atoms/ScrollReveal";
import { Skeleton } from "@ui/atoms/Skeleton";
import { ImportVehicleCard } from "../components/ImportVehicleCard";
import { ImportVehicleGridCard } from "../components/ImportVehicleGridCard";
import "../styles/catalog.css";

type ViewMode = "horizontal" | "grid";

export function ImportsPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<CatalogVehicle[] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");

  useEffect(() => {
    void catalogUseCases.filterVehicles.execute({}).then(setVehicles);
  }, []);

  return (
    <section style={{ padding: "40px 0 80px" }}>
      <header
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32, flexWrap: "wrap" }}
      >
        <div>
          <Eyebrow>{t("imports.eyebrow")}</Eyebrow>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginTop: 12 }}>{t("imports.title")}</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 640 }}>{t("imports.subtitle")}</p>
        </div>

        <div className="catalog-view-toggle" role="group" aria-label="view mode">
          <button
            type="button"
            className={`catalog-view-toggle__btn ${viewMode === "horizontal" ? "catalog-view-toggle__btn--active" : ""}`}
            onClick={() => setViewMode("horizontal")}
            aria-pressed={viewMode === "horizontal"}
            aria-label={t("catalog.viewHorizontal")}
          >
            <LayoutList size={16} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className={`catalog-view-toggle__btn ${viewMode === "grid" ? "catalog-view-toggle__btn--active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label={t("catalog.viewGrid")}
          >
            <LayoutGrid size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </header>

      {vehicles === null ? (
        <div className={viewMode === "grid" ? "catalog-grid--fixed" : "vehicle-stack"}>
          {Array.from({ length: viewMode === "grid" ? 8 : 3 }).map((_, i) => (
            <Skeleton key={i} height={viewMode === "grid" ? 340 : 420} radius={viewMode === "grid" ? "var(--radius-lg)" : "28px"} />
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="catalog-grid--fixed">
          {vehicles.map((vehicle, i) => (
            <ImportVehicleGridCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      ) : (
        <div className="vehicle-stack">
          {vehicles.map((vehicle, i) => (
            <ScrollReveal key={vehicle.id} delay={(i % 3) * 100}>
              <ImportVehicleCard vehicle={vehicle} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
