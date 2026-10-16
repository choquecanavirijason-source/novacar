/**
 * Presentation · Component · ImportCalculatorModal
 * Calculadora libre de importación: el cliente elige auto o moto, busca
 * marca/modelo en el catálogo de referencia (import-models.json, carga bajo
 * demanda — también acepta texto libre si su modelo no está), indica precio
 * en origen y país, y ve el desglose estimado en vivo. Cálculo mock del lado
 * del cliente — mismas reglas de ejemplo que ImportQuoteModal.
 */

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Bike, Calculator, Car, Send, X } from "lucide-react";
import type { ImportModelCatalog, ImportVehicleKind } from "../../domain/entities/ImportModelCatalog";
import { catalogUseCases } from "../../di";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { ModalPortal } from "@ui/atoms/ModalPortal";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { useQuoteRequestStore } from "@features/quote_requests";
import "../styles/catalog.css";

type Origin = "usa" | "japan" | "europe" | "china";

/** Flete + logística estimados por origen y tipo de vehículo (MXN). */
const SHIPPING: Record<ImportVehicleKind, Record<Origin, number>> = {
  car: { usa: 25000, japan: 42000, europe: 48000, china: 38000 },
  moto: { usa: 9000, japan: 14000, europe: 16000, china: 12000 },
};
const IMPORT_TAX_RATE = 0.16;
/** Recargo de ejemplo para vehículos con más de 8 años. */
const OLD_VEHICLE_SURCHARGE = 0.05;
const INSURANCE_RATE = 0.02;
const OLD_VEHICLE_AGE = 8;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 26 }, (_, i) => CURRENT_YEAR + 1 - i);
const ORIGINS: Origin[] = ["usa", "japan", "europe", "china"];
const KINDS: { kind: ImportVehicleKind; Icon: typeof Car }[] = [
  { kind: "car", Icon: Car },
  { kind: "moto", Icon: Bike },
];

export function ImportCalculatorModal({ onClose }: { onClose: () => void }) {
  const { t, locale } = useTranslation();
  const toast = useToast();
  const createQuoteRequest = useQuoteRequestStore((s) => s.create);
  const panelRef = useModalA11y<HTMLDivElement>(onClose);

  const [catalog, setCatalog] = useState<ImportModelCatalog | null>(null);
  const [kind, setKind] = useState<ImportVehicleKind>("car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [origin, setOrigin] = useState<Origin>("usa");
  const [price, setPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let alive = true;
    void catalogUseCases.getImportModels().then((c) => alive && setCatalog(c));
    return () => {
      alive = false;
    };
  }, []);

  const brands = useMemo(() => catalog?.[kind] ?? [], [catalog, kind]);
  // Búsqueda O(1) por marca (normalizada) en vez de recorrer la lista en cada tecla.
  const modelsByBrand = useMemo(
    () => new Map(brands.map((b) => [b.brand.toLowerCase(), b.models])),
    [brands],
  );
  const models = modelsByBrand.get(brand.trim().toLowerCase()) ?? [];

  const quote = useMemo(() => {
    const isOld = CURRENT_YEAR - year > OLD_VEHICLE_AGE;
    const taxes = Math.round(price * (IMPORT_TAX_RATE + (isOld ? OLD_VEHICLE_SURCHARGE : 0)));
    const insurance = Math.round(price * INSURANCE_RATE);
    const shipping = price > 0 ? SHIPPING[kind][origin] : 0;
    return { isOld, taxes, insurance, shipping, total: price + taxes + insurance + shipping };
  }, [price, year, origin, kind]);

  const canSubmit = Boolean(brand.trim() && model.trim() && price > 0 && email.trim()) && !sending;

  const changeKind = (next: ImportVehicleKind) => {
    if (next === kind) return;
    setKind(next);
    setBrand("");
    setModel("");
  };

  const changeBrand = (value: string) => {
    setBrand(value);
    setModel("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    const ok = await createQuoteRequest({
      source: "import",
      customerEmail: email.trim(),
      subject: `${t(`imports.calcKind_${kind}`)} · ${brand.trim()} ${model.trim()} · ${year} (${t(`imports.calcOrigin_${origin}`)})`,
      details: [
        `${t("imports.quoteBasePrice")}: ${formatCurrency(price, locale)}`,
        `${t("imports.quoteTaxes")}: ${formatCurrency(quote.taxes, locale)}`,
        `${t("imports.calcInsurance")}: ${formatCurrency(quote.insurance, locale)}`,
        `${t("imports.quoteShipping")}: ${formatCurrency(quote.shipping, locale)}`,
      ].join(" · "),
      amount: quote.total,
    });
    setSending(false);
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
        aria-label={t("imports.calcTitle")}
        onClick={onClose}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          className="import-quote-panel import-calc-panel glass-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="import-quote-close" onClick={onClose} aria-label={t("productInquiry.close")}>
            <X size={18} strokeWidth={1.75} aria-hidden />
          </button>

          <div className="import-quote-vehicle">
            <span className="import-calc-icon" aria-hidden>
              <Calculator size={24} strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="import-quote-title import-calc-title">{t("imports.calcTitle")}</h2>
              <p className="import-quote-vehicle__name">{t("imports.calcSubtitle")}</p>
            </div>
          </div>

          <form className="import-calc-layout" onSubmit={handleSubmit}>
            {/* Columna izquierda: datos del vehículo */}
            <div className="import-calc-form">
              <div className="import-calc-kinds" role="radiogroup" aria-label={t("imports.calcKind")}>
                {KINDS.map(({ kind: k, Icon }) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    className={`import-calc-kind ${kind === k ? "import-calc-kind--active" : ""}`}
                    onClick={() => changeKind(k)}
                  >
                    <Icon size={20} strokeWidth={1.75} aria-hidden />
                    {t(`imports.calcKind_${k}`)}
                  </button>
                ))}
              </div>

              <label className="import-calc-field">
                <span>{t("imports.calcBrand")}</span>
                <input
                  className="test-drive-input"
                  list="import-calc-brands"
                  placeholder={catalog ? t("imports.calcBrandPlaceholder") : t("imports.calcLoading")}
                  value={brand}
                  onChange={(e) => changeBrand(e.target.value)}
                  maxLength={40}
                  autoComplete="off"
                  required
                />
                <datalist id="import-calc-brands">
                  {brands.map((b) => (
                    <option key={b.brand} value={b.brand} />
                  ))}
                </datalist>
              </label>

              <label className="import-calc-field">
                <span>{t("imports.calcModel")}</span>
                <input
                  className="test-drive-input"
                  list="import-calc-models"
                  placeholder={models.length ? t("imports.calcModelPlaceholder") : t("imports.calcModelFree")}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  maxLength={60}
                  autoComplete="off"
                  required
                />
                <datalist id="import-calc-models">
                  {models.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </label>

              <div className="test-drive-row">
                <label className="import-calc-field">
                  <span>{t("imports.calcYear")}</span>
                  <select className="test-drive-input" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="import-calc-field">
                  <span>{t("imports.calcPrice")}</span>
                  <input
                    className="test-drive-input"
                    inputMode="numeric"
                    placeholder="0"
                    value={price > 0 ? price.toLocaleString(locale) : ""}
                    onChange={(e) => setPrice(Number(e.target.value.replace(/\D/g, "")) || 0)}
                    required
                  />
                </label>
              </div>

              <div className="import-calc-field">
                <span>{t("imports.calcOrigin")}</span>
                <div className="import-calc-origins" role="radiogroup" aria-label={t("imports.calcOrigin")}>
                  {ORIGINS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      role="radio"
                      aria-checked={origin === o}
                      className={`import-calc-origin ${origin === o ? "import-calc-origin--active" : ""}`}
                      onClick={() => setOrigin(o)}
                    >
                      {t(`imports.calcOrigin_${o}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha: desglose + envío */}
            <div className="import-calc-summary">
              <div className="import-quote-breakdown">
                <div className="import-quote-row">
                  <span>{t("imports.quoteBasePrice")}</span>
                  <span>{formatCurrency(price, locale)}</span>
                </div>
                <div className="import-quote-row">
                  <span>
                    {t("imports.quoteTaxes")}
                    {quote.isOld && <em className="import-calc-note"> · {t("imports.calcOldSurcharge")}</em>}
                  </span>
                  <span>{formatCurrency(quote.taxes, locale)}</span>
                </div>
                <div className="import-quote-row">
                  <span>{t("imports.calcInsurance")}</span>
                  <span>{formatCurrency(quote.insurance, locale)}</span>
                </div>
                <div className="import-quote-row">
                  <span>{t("imports.quoteShipping")}</span>
                  <span>{formatCurrency(quote.shipping, locale)}</span>
                </div>
                <div className="import-quote-row import-quote-row--total">
                  <span>{t("imports.quoteTotal")}</span>
                  <span>{formatCurrency(quote.total, locale)}</span>
                </div>
                <div className="import-quote-row import-quote-row--muted">
                  <span>{t("imports.quoteEta")}</span>
                  <span>{t("imports.quoteEtaValue")}</span>
                </div>
              </div>

              <p className="import-quote-disclaimer" style={{ marginTop: 0 }}>
                {t("imports.quoteDisclaimer")}
              </p>

              {sent ? (
                <p className="import-quote-success" role="status" style={{ marginTop: 0 }}>
                  {t("imports.quoteSuccess")}
                </p>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    className="test-drive-input"
                    placeholder={t("imports.quoteEmailPlaceholder")}
                    aria-label={t("imports.quoteEmailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="test-drive-submit" disabled={!canSubmit}>
                    <Send size={14} strokeWidth={2} aria-hidden style={{ marginRight: 6, verticalAlign: -2 }} />
                    {t("imports.quoteSubmit")}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
