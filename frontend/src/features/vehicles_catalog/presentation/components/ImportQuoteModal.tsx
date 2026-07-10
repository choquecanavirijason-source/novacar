/**
 * Presentation · Component · ImportQuoteModal
 * Popup de "cotización automática" para Importaciones. Muestra un desglose
 * de ejemplo (precio base + impuestos + flete estimados) — el motor de
 * cotización real en tiempo real se conectará más adelante; por ahora es
 * un cálculo simple del lado del cliente, claramente marcado como ejemplo.
 */

"use client";

import { X } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { vehiclePhotoUrl } from "../vehiclePresentation";
import "../styles/catalog.css";

const IMPORT_TAX_RATE = 0.16;
const SHIPPING_ESTIMATE = 25000;

export function ImportQuoteModal({
  vehicle,
  onClose,
}: {
  vehicle: CatalogVehicle;
  onClose: () => void;
}) {
  const { t, locale } = useTranslation();
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const taxes = Math.round(vehicle.price * IMPORT_TAX_RATE);
  const total = vehicle.price + taxes + SHIPPING_ESTIMATE;

  return (
    <div
      className="import-quote-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("imports.quoteModalTitle")}
      onClick={onClose}
    >
      <div ref={panelRef} tabIndex={-1} className="import-quote-panel glass-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="import-quote-close" onClick={onClose} aria-label={t("productInquiry.close")}>
          <X size={18} strokeWidth={1.75} aria-hidden />
        </button>

        <div className="import-quote-vehicle">
          {/* eslint-disable-next-line @next/next/no-img-element -- placeholder, se reemplaza por asset real */}
          <img
            className="import-quote-vehicle__img"
            src={vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 200, h: 150 })}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <h2 className="import-quote-title">{t("imports.quoteModalTitle")}</h2>
            <p className="import-quote-vehicle__name">
              {vehicle.brand} {vehicle.model} · {vehicle.year}
            </p>
          </div>
        </div>

        <div className="import-quote-breakdown">
          <div className="import-quote-row">
            <span>{t("imports.quoteBasePrice")}</span>
            <span>{formatCurrency(vehicle.price, locale)}</span>
          </div>
          <div className="import-quote-row">
            <span>{t("imports.quoteTaxes")}</span>
            <span>{formatCurrency(taxes, locale)}</span>
          </div>
          <div className="import-quote-row">
            <span>{t("imports.quoteShipping")}</span>
            <span>{formatCurrency(SHIPPING_ESTIMATE, locale)}</span>
          </div>
          <div className="import-quote-row import-quote-row--total">
            <span>{t("imports.quoteTotal")}</span>
            <span>{formatCurrency(total, locale)}</span>
          </div>
          <div className="import-quote-row import-quote-row--muted">
            <span>{t("imports.quoteEta")}</span>
            <span>{t("imports.quoteEtaValue")}</span>
          </div>
        </div>

        <p className="import-quote-disclaimer">{t("imports.quoteDisclaimer")}</p>
      </div>
    </div>
  );
}
