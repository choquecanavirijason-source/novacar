/**
 * Presentation · Component · ImportVehicleGridCard
 * Vista "Cuadrícula" de Importaciones (mismo patrón que VehicleGridCard en
 * /catalogo), pero usando la misma imagen que la vista "Lista"
 * (ImportVehicleCard: recorte PNG por marca, con fallback a la foto real) —
 * si no, el mismo auto se ve con una foto distinta según la vista, lo cual
 * confunde. A diferencia de VehicleGridCard, no navega al detalle: el CTA
 * abre el popup de cotización automática (ImportQuoteModal), que es el
 * objetivo de esta sección.
 */

"use client";

import { useEffect, useState } from "react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { ProductCard } from "@ui/molecules/ProductCard";
import { bodyTypeKey, mileageText, transmissionKey, vehiclePhotoUrl } from "../vehiclePresentation";
import { ImportQuoteModal } from "./ImportQuoteModal";

/** PNG transparente por marca: `public/vehicles/{Marca}.png` (subir manualmente). */
const vehicleCutoutUrl = (brand: string) => `/vehicles/${brand}.png`;

export function ImportVehicleGridCard({ vehicle, index = 0 }: { vehicle: CatalogVehicle; index?: number }) {
  const { t, locale } = useTranslation();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [cutoutOk, setCutoutOk] = useState(false);

  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 640, h: 480 }, vehicle.imageUrl);
  const cutoutUrl = vehicleCutoutUrl(vehicle.brand);

  useEffect(() => {
    setCutoutOk(false);
    const img = new window.Image();
    img.onload = () => setCutoutOk(true);
    img.onerror = () => setCutoutOk(false);
    img.src = cutoutUrl;
  }, [cutoutUrl]);

  return (
    <>
      <ProductCard
        onCtaClick={() => setQuoteOpen(true)}
        index={index}
        accentFrom="#1c1c1c"
        accentTo="#0a0a0a"
        photoHeight={210}
        imageUrl={cutoutOk ? cutoutUrl : photoUrl}
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
        ctaLabel={t("imports.quoteCta")}
      />
      {quoteOpen && <ImportQuoteModal vehicle={vehicle} onClose={() => setQuoteOpen(false)} />}
    </>
  );
}
