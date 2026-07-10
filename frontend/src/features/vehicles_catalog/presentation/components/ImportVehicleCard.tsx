/**
 * Presentation · Component · ImportVehicleCard
 * Mismo formato de tarjeta que "Destacados" (columna de specs + auto PNG +
 * tarjeta flotante de precio), pero estática (un vehículo fijo, sin
 * carrusel) y con CTA "Cotizar importación" que abre el popup de cotización
 * automática (ImportQuoteModal) en vez de navegar al detalle.
 */

"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { fuelKey, transmissionKey, vehiclePhotoUrl } from "../vehiclePresentation";
import { ImportQuoteModal } from "./ImportQuoteModal";

const vehicleCutoutUrl = (brand: string) => `/vehicles/${brand}.png`;

export function ImportVehicleCard({ vehicle, index = 0 }: { vehicle: CatalogVehicle; index?: number }) {
  const { t, locale } = useTranslation();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const specs = [
    { label: t("featured.specPower"), value: t("showcase.hp", { n: vehicle.horsepower }) },
    { label: t("featured.specFuel"), value: t(fuelKey[vehicle.fuelType]) },
    { label: t("featured.specTransmission"), value: t(transmissionKey[vehicle.transmission]) },
    {
      label: t("featured.specMileage"),
      value: vehicle.mileageKm === 0 ? t("common.new") : `${vehicle.mileageKm.toLocaleString(locale)} km`,
    },
  ];

  return (
    <>
      <div
        className="relative flex flex-col overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-base) p-8 transition-colors duration-300 hover:border-(--accent-neon) lg:flex-row lg:p-16"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Marca de agua decorativa */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-4 right-2 z-0 select-none text-[5rem] font-black uppercase leading-none text-white/5 sm:text-[7rem] lg:-top-8 lg:right-6 lg:text-[9rem]"
        >
          {t("imports.watermark")}
        </span>

        {/* Columna izquierda: ficha técnica */}
        <div className="relative z-10 flex w-full flex-col justify-center space-y-10 text-left lg:w-1/2 lg:space-y-12">
          <div>
            <h3 className="text-3xl font-bold text-white sm:text-4xl">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-2 text-(--text-secondary)">
              {vehicle.year} · {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-(--accent-neon)" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{spec.label}</span>
                <span className="font-semibold text-white">{spec.value}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="relative inline-flex w-fit items-center overflow-hidden rounded-(--radius-btn) border border-(--accent-neon)/40 px-6 py-3 text-sm font-semibold text-white transform-[skewX(-12deg)] transition-colors duration-300 hover:border-(--accent-neon) hover:bg-(--accent-soft)"
          >
            <span
              className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/15 via-white/0 to-black/15"
              aria-hidden
            />
            <span className="relative inline-flex items-center gap-2 transform-[skewX(12deg)]">
              {t("imports.quoteCta")}
              <FileText size={16} strokeWidth={1.75} aria-hidden />
            </span>
          </button>
        </div>

        {/* Columna derecha: auto */}
        <div className="relative z-10 mt-12 min-h-[280px] w-full lg:mt-0 lg:min-h-0 lg:w-1/2">
          <div className="pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- PNG transparente manual si existe; si no, foto real de respaldo */}
            <img
              className="absolute top-1/2 right-0 w-[120%] max-w-none -translate-y-1/2 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] lg:-right-10 lg:drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
              src={vehicleCutoutUrl(vehicle.brand)}
              alt={`${vehicle.brand} ${vehicle.model}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const fallback = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 900, h: 900 });
                if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
              }}
            />
          </div>
        </div>

        {/* Tarjeta flotante de precio */}
        <div className="absolute bottom-5 right-5 z-20 max-w-[170px] rounded-xl border border-white/10 bg-(--bg-elevated)/30 px-4 py-3 backdrop-blur-(--glass-blur)">
          <span className="text-[0.65rem] uppercase tracking-wide text-gray-400">
            {t("featured.priceCaption")}
          </span>
          <p className="mt-0.5 text-lg font-bold text-white">{formatCurrency(vehicle.price, locale)}</p>
          <div className="my-2 h-px bg-white/10" />
          <p className="line-clamp-2 text-[0.7rem] leading-relaxed text-gray-300">{vehicle.tagline}</p>
        </div>
      </div>

      {quoteOpen && <ImportQuoteModal vehicle={vehicle} onClose={() => setQuoteOpen(false)} />}
    </>
  );
}
