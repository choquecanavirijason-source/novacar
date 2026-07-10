/**
 * Presentation · Component · VehicleDetail (client)
 * "Ver más" de un auto: hero "Broken Grid" (tríptico de fondo con crops del
 * mismo vehículo en tratamiento técnico/desaturado + la foto real del auto
 * en primer plano, rompiendo las columnas vía z-index) con acentos
 * brutalistas (decals, retículas, VIN), seguido de la tarjeta de precio de
 * lista y el grid de especificaciones técnicas. Tailwind + tokens del
 * proyecto vía sintaxis `bg-(--token)`. Recibe la entidad ya resuelta
 * (server) y la traduce.
 */

"use client";

import { CheckCircle2 } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Breadcrumbs } from "@ui/molecules/Breadcrumbs";
import {
  bodyTypeKey,
  fuelKey,
  transmissionKey,
  mileageText,
  vehiclePhotoUrl,
} from "../vehiclePresentation";
import "../styles/catalog.css";

/** Crops del tríptico: mismo vehículo, tres encuadres distintos (efecto "detalle técnico"). */
const TRIPTYCH_COLUMNS = [
  { key: "ext", label: "01 / EXTERIOR", position: "12% 35%" },
  { key: "chs", label: "02 / CHASIS", position: "52% 55%" },
  { key: "det", label: "03 / DETALLE", position: "88% 30%" },
] as const;

export function VehicleDetail({ vehicle }: { vehicle: CatalogVehicle }) {
  const { t, locale } = useTranslation();

  const specColumns = [
    {
      title: t("detail.specMotor"),
      items: [t(fuelKey[vehicle.fuelType]), `${vehicle.horsepower} HP`],
      isTech: false,
    },
    {
      title: t("detail.specPerformance"),
      items: [
        t(transmissionKey[vehicle.transmission]),
        vehicle.condition === "nuevo" ? t("common.new") : t("common.used"),
      ],
      isTech: false,
    },
    {
      title: t("detail.specDimensions"),
      items: [
        t(bodyTypeKey[vehicle.bodyType]),
        `${vehicle.seats} ${t("detail.seats").toLowerCase()}`,
        `${vehicle.year}`,
        mileageText(vehicle.mileageKm, t),
      ],
      isTech: false,
    },
    {
      title: t("detail.specTech"),
      items: vehicle.features,
      isTech: true,
    },
  ];

  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 1920, h: 1080 });

  return (
    <>
      {/* Bloque 1: Hero "Broken Grid" — tríptico técnico de fondo + auto real en primer plano */}
      <section className="vdetail-hero relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen overflow-hidden">
        <Breadcrumbs
          className="vdetail-hero__crumbs"
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.catalog"), href: "/catalogo" },
            { label: `${vehicle.brand} ${vehicle.model}` },
          ]}
        />

        {/* Tríptico de fondo: 3 columnas, mismo vehículo con encuadres distintos */}
        <div className="vdetail-triptych" aria-hidden>
          {TRIPTYCH_COLUMNS.map((col) => (
            <div key={col.key} className="vdetail-triptych__col">
              {/* eslint-disable-next-line @next/next/no-img-element -- crop técnico decorativo, no informativo */}
              <img
                className="vdetail-triptych__img"
                src={photoUrl}
                alt=""
                style={{ objectPosition: col.position }}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="vdetail-decal">{col.label}</span>
            </div>
          ))}
        </div>

        {/* Acentos brutalistas: retícula + VIN corrido */}
        <span className="vdetail-crosshair vdetail-crosshair--br" aria-hidden />
        <span className="vdetail-vin" aria-hidden>
          {vehicle.id.toUpperCase().replace(/-/g, " · ")}
        </span>

        {/* Auto real: rompe la cuadrícula del tríptico, capa superior */}
        <div className="vdetail-breakout">
          {/* eslint-disable-next-line @next/next/no-img-element -- placeholder, se reemplaza por asset real */}
          <img
            className="vdetail-breakout__img"
            src={photoUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="vdetail-hero__copy">
            <span className="vdetail-hero__brand">{vehicle.brand}</span>
            <h1 className="vdetail-hero__title">{vehicle.model}</h1>
          </div>
        </div>
      </section>

      {/* Tarjeta única: precio de lista + especificaciones */}
      <section className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen bg-(--bg-base)">
        <div className="vdetail-pricecard-wrap">
          <div className="vdetail-pricecard">
            <div className="vdetail-pricecard__top">
              <span className="vdetail-pricecard__label">{t("detail.listPrice")}</span>
              <span className="vdetail-pricecard__badge">
                {vehicle.condition === "nuevo" ? t("common.new") : t("common.used")}
              </span>
            </div>

            <span className="vdetail-pricecard__value">{formatCurrency(vehicle.price, locale)}</span>

            <p className="vdetail-pricecard__tagline">{vehicle.tagline}</p>

            <div className="vdetail-pricecard__divider" />

            <div className="vdetail-pricecard__meta">
              <span>{vehicle.year}</span>
              <span>{mileageText(vehicle.mileageKm, t)}</span>
              <span>{t(fuelKey[vehicle.fuelType])}</span>
            </div>

            <div className="vdetail-pricecard__actions">
              <Button>{t("detail.testDrive")}</Button>
              <Button href="/buscador" variant="ghost">
                {t("detail.findParts")}
              </Button>
            </div>

            <div className="vdetail-pricecard__divider" />

            <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {specColumns.map((col) => (
                <div key={col.title} className="py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0 lg:first:pl-0 lg:last:pr-0">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
                    {col.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                        {col.isTech && (
                          <CheckCircle2 size={14} strokeWidth={2} className="shrink-0 text-(--accent-neon)" aria-hidden />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
