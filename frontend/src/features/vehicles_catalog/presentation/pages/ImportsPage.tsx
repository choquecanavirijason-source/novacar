/**
 * Presentation · Page · ImportsPage
 * Sección "Importaciones": lista los vehículos disponibles usando el mismo
 * formato de tarjeta que "Destacados". El cliente elige un auto y el CTA
 * abre la cotización automática (mock, ver ImportQuoteModal).
 */

"use client";

import { useEffect, useState } from "react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Skeleton } from "@ui/atoms/Skeleton";
import { ImportVehicleCard } from "../components/ImportVehicleCard";

export function ImportsPage() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<CatalogVehicle[] | null>(null);

  useEffect(() => {
    void catalogUseCases.filterVehicles.execute({}).then(setVehicles);
  }, []);

  return (
    <section style={{ padding: "40px 0 80px" }}>
      <header style={{ marginBottom: 32 }}>
        <Eyebrow>{t("imports.eyebrow")}</Eyebrow>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginTop: 12 }}>{t("imports.title")}</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 640 }}>{t("imports.subtitle")}</p>
      </header>

      {vehicles === null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={420} radius="28px" />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {vehicles.map((vehicle, i) => (
            <ImportVehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
