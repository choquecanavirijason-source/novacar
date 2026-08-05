/**
 * Presentation · Component · ImportQuoteModal
 * Popup de "cotización automática" para Importaciones. Muestra un desglose
 * de ejemplo (precio base + impuestos + flete estimados) — el motor de
 * cotización real en tiempo real se conectará más adelante; por ahora es
 * un cálculo simple del lado del cliente, claramente marcado como ejemplo.
 */

"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Send, X } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { useQuoteRequestStore } from "@features/quote_requests";
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
  const toast = useToast();
  const createQuoteRequest = useQuoteRequestStore((s) => s.create);
  const panelRef = useModalA11y<HTMLDivElement>(onClose);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const taxes = Math.round(vehicle.price * IMPORT_TAX_RATE);
  const total = vehicle.price + taxes + SHIPPING_ESTIMATE;
  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 200, h: 150 });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await createQuoteRequest({
      source: "import",
      customerEmail: email.trim(),
      subject: `${vehicle.brand} ${vehicle.model} · ${vehicle.year}`,
      details: `${t("imports.quoteBasePrice")}: ${formatCurrency(vehicle.price, locale)} · ${t("imports.quoteTaxes")}: ${formatCurrency(taxes, locale)} · ${t("imports.quoteShipping")}: ${formatCurrency(SHIPPING_ESTIMATE, locale)}`,
      amount: total,
    });
    if (ok) {
      setSent(true);
      toast.success(t("imports.quoteSuccess"));
    }
  };

  return (
    <ModalPortal>
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
          {!photoFailed && (
            <Image
              className="import-quote-vehicle__img"
              src={photoUrl}
              alt=""
              width={72}
              height={54}
              unoptimized={photoUrl.startsWith("http")}
              onError={() => setPhotoFailed(true)}
            />
          )}
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

        {sent ? (
          <p className="import-quote-success" role="status">
            {t("imports.quoteSuccess")}
          </p>
        ) : (
          <form className="import-quote-form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              className="import-quote-form__input"
              placeholder={t("imports.quoteEmailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label={t("imports.quoteEmailPlaceholder")}
            />
            <button type="submit" className="import-quote-form__submit">
              <Send size={14} strokeWidth={2} aria-hidden style={{ marginRight: 6, verticalAlign: -2 }} />
              {t("imports.quoteSubmit")}
            </button>
          </form>
        )}
      </div>
      </div>
    </ModalPortal>
  );
}
