/**
 * Presentation · Component · FeaturedVehicles
 * Client component: carga destacados vía use case y los traduce.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Skeleton } from "@ui/atoms/Skeleton";
import { VehicleCard } from "./VehicleCard";

export function FeaturedVehicles() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<CatalogVehicle[] | null>(null);

  useEffect(() => {
    void catalogUseCases.getFeaturedVehicles.execute().then(setVehicles);
  }, []);

  return (
    <section style={{ padding: "16px 0 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
        <div>
          <Eyebrow>{t("featured.eyebrow")}</Eyebrow>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 800, marginTop: 10 }}>{t("featured.title")}</h2>
        </div>
        <Link href="/catalogo" style={{ color: "var(--accent-neon)", fontWeight: 700, fontSize: "0.92rem" }}>
          {t("common.seeAll")} →
        </Link>
      </div>

      <div className="catalog-grid">
        {vehicles === null
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={320} radius="var(--radius-lg)" />)
          : vehicles.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
      </div>
    </section>
  );
}
