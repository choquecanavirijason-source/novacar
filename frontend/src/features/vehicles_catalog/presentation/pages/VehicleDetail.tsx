/**
 * Presentation · Component · VehicleDetail (client)
 * Vista de detalle de un auto. Recibe la entidad ya resuelta (server) y la traduce.
 */

"use client";

import Link from "next/link";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import {
  bodyTypeIcon,
  bodyTypeKey,
  fuelKey,
  transmissionKey,
  mileageText,
} from "../vehiclePresentation";
import "../styles/catalog.css";

export function VehicleDetail({ vehicle }: { vehicle: CatalogVehicle }) {
  const { t } = useTranslation();

  const specs = [
    { label: t("detail.year"), value: String(vehicle.year) },
    { label: t("detail.mileage"), value: mileageText(vehicle.mileageKm, t) },
    { label: t("detail.body"), value: t(bodyTypeKey[vehicle.bodyType]) },
    { label: t("detail.fuel"), value: t(fuelKey[vehicle.fuelType]) },
    { label: t("detail.transmission"), value: t(transmissionKey[vehicle.transmission]) },
    { label: t("detail.power"), value: `${vehicle.horsepower} hp` },
    { label: t("detail.seats"), value: `${vehicle.seats}` },
    { label: t("detail.condition"), value: vehicle.condition === "nuevo" ? t("common.new") : t("common.used") },
  ];

  return (
    <section style={{ paddingTop: 24 }}>
      <Link href="/catalogo" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        ← {t("detail.back")}
      </Link>

      <div className="detail">
        <div
          className="detail__photo"
          style={{ background: `linear-gradient(140deg, ${vehicle.accentFrom}, ${vehicle.accentTo})` }}
        >
          <span className="vehicle-card__icon">{bodyTypeIcon[vehicle.bodyType]}</span>
        </div>

        <div>
          <Eyebrow>{vehicle.brand}</Eyebrow>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, margin: "12px 0 6px" }}>{vehicle.model}</h1>
          <p style={{ color: "var(--text-secondary)" }}>{vehicle.tagline}</p>

          <div className="text-gradient" style={{ fontSize: "2.2rem", fontWeight: 900, margin: "18px 0" }}>
            {formatCurrency(vehicle.price)}
          </div>

          <div className="detail__specs-grid">
            {specs.map((s) => (
              <div key={s.label} className="detail__spec">
                <div className="detail__spec-label">{s.label}</div>
                <div className="detail__spec-value">{s.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontWeight: 700, margin: "8px 0 10px" }}>{t("detail.features")}</h3>
          <div className="detail__features">
            {vehicle.features.map((f) => (
              <div key={f} className="detail__feature">{f}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Button>{t("detail.testDrive")}</Button>
            <Button href="/buscador" variant="ghost">{t("detail.findParts")}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
