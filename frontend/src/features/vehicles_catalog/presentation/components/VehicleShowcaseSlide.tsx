/**
 * Presentation · Component · VehicleShowcaseSlide
 * Adapta un CatalogVehicle a las props de VehicleShowcaseCard (imagen real,
 * HP, ficha técnica, precio/tagline, CTA a detalle). Común para Home
 * (Destacados) y /catalogo, para no duplicar el mapeo en cada vista.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { ScrollReveal } from "@ui/atoms/ScrollReveal";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { fuelKey, transmissionKey, vehiclePhotoUrl } from "../vehiclePresentation";
import { VehicleShowcaseCard } from "./VehicleShowcaseCard";

export function VehicleShowcaseSlide({
  vehicle,
  index = 0,
  total = 1,
}: {
  vehicle: CatalogVehicle;
  index?: number;
  total?: number;
}) {
  const { t } = useTranslation();

  return (
    <ScrollReveal>
      <VehicleShowcaseCard
        imageUrl={vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 1600, h: 1000 })}
        imageAlt={`${vehicle.brand} ${vehicle.model}`}
        hpLabel={t("showcase.hp", { n: vehicle.horsepower })}
        techLabel={`${t(fuelKey[vehicle.fuelType])} · ${t(transmissionKey[vehicle.transmission])}`}
        title={`${vehicle.brand} ${vehicle.model}`}
        subtitle={`${vehicle.year} · ${vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}`}
        description={vehicle.tagline}
        ctaLabel={t("showcase.readMore")}
        ctaHref={`/catalogo/${vehicle.id}`}
        totalPages={total}
        activeIndex={index}
      />
    </ScrollReveal>
  );
}
