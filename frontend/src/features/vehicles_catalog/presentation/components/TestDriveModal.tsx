/**
 * Presentation · Component · TestDriveModal
 * Popup para agendar una prueba de manejo desde el detalle de un vehículo.
 * Reutiliza la misma bandeja de solicitudes que "Cotizar importación"
 * (quote_requests) con `source: "test_drive"`, así el admin la ve y
 * gestiona en el mismo panel de Cotizaciones.
 */

"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { CalendarCheck, X } from "lucide-react";
import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { useQuoteRequestStore } from "@features/quote_requests";
import { vehiclePhotoUrl } from "../vehiclePresentation";
import "../styles/catalog.css";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function TestDriveModal({ vehicle, onClose }: { vehicle: CatalogVehicle; onClose: () => void }) {
  const { t, locale } = useTranslation();
  const toast = useToast();
  const createQuoteRequest = useQuoteRequestStore((s) => s.create);
  const panelRef = useModalA11y<HTMLDivElement>(onClose);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("10:00");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const photoUrl = vehiclePhotoUrl(vehicle.id, vehicle.brand, vehicle.bodyType, { w: 200, h: 150 }, vehicle.imageUrl);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setSaving(true);
    const dateLabel = new Date(`${date}T${time}`).toLocaleString(locale === "es" ? "es-MX" : "en-US", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    const ok = await createQuoteRequest({
      source: "test_drive",
      customerEmail: email.trim(),
      subject: `${vehicle.brand} ${vehicle.model} · ${vehicle.year}`,
      details: `${t("detail.testDriveName")}: ${name.trim()} · ${t("detail.testDrivePhone")}: ${phone.trim()} · ${t("detail.testDriveWhen")}: ${dateLabel}`,
      amount: null,
    });
    setSaving(false);
    if (ok) {
      setSent(true);
      toast.success(t("detail.testDriveSuccess"));
    }
  };

  return (
    <ModalPortal>
      <div
        className="import-quote-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t("detail.testDriveModalTitle")}
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
              <h2 className="import-quote-title">{t("detail.testDriveModalTitle")}</h2>
              <p className="import-quote-vehicle__name">
                {vehicle.brand} {vehicle.model} · {vehicle.year}
              </p>
            </div>
          </div>

          <p className="import-quote-disclaimer">{t("detail.testDriveDisclaimer")}</p>

          {sent ? (
            <p className="import-quote-success" role="status">
              {t("detail.testDriveSuccess")}
            </p>
          ) : (
            <form className="test-drive-form" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                className="test-drive-input"
                placeholder={t("detail.testDriveName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label={t("detail.testDriveName")}
              />
              <input
                type="email"
                required
                className="test-drive-input"
                placeholder={t("imports.quoteEmailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label={t("imports.quoteEmailPlaceholder")}
              />
              <input
                type="tel"
                required
                className="test-drive-input"
                placeholder={t("detail.testDrivePhone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label={t("detail.testDrivePhone")}
              />
              <div className="test-drive-row">
                <input
                  type="date"
                  required
                  min={todayISO()}
                  className="test-drive-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label={t("detail.testDriveDate")}
                />
                <input
                  type="time"
                  required
                  className="test-drive-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-label={t("detail.testDriveTime")}
                />
              </div>
              <button type="submit" className="test-drive-submit" disabled={saving}>
                <CalendarCheck size={14} strokeWidth={2} aria-hidden style={{ marginRight: 6, verticalAlign: -2 }} />
                {saving ? t("common.loading") : t("detail.testDriveSubmit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
