/**
 * Presentation · Component · VehicleGridCard
 * Tarjeta compacta para el modo "Cuadrícula" del catálogo, sobre el common
 * @ui/ProductCard (mismo patrón que PartCard en el marketplace): foto real,
 * condición, precio, specs cortas y CTA. Medidas uniformes vía CSS Grid
 * (todas las tarjetas de una fila comparten alto automáticamente).
 */

"use client";

import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { ProductCard } from "@ui/molecules/ProductCard";
import { bodyTypeKey, mileageText, transmissionKey, vehiclePhotoUrl } from "../vehiclePresentation";

export function VehicleGridCard({ vehicle, index = 0 }: { vehicle: CatalogVehicle; index?: number }) {
  const { t, locale } = useTranslation();

  return (
    <ProductCard
      href={`/catalogo/${vehicle.id}`}
      index={index}
      accentFrom={vehicle.accentFrom}
      accentTo={vehicle.accentTo}
      photoHeight={170}
      imageUrl={vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 640, h: 480 })}
      imageAlt={`${vehicle.brand} ${vehicle.model}`}
      photoTopSlot={
        <div className="grid-card__badges">
          <span className="tag-pill">{vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}</span>
        </div>
      }
      title={`${vehicle.brand} ${vehicle.model}`}
      subtitle={<span className="text-gradient">{formatCurrency(vehicle.price, locale)}</span>}
      features={[
        t(bodyTypeKey[vehicle.bodyType]),
        t(transmissionKey[vehicle.transmission]),
        mileageText(vehicle.mileageKm, t),
      ]}
      ctaLabel={t("showcase.readMore")}
    />
  );
}
