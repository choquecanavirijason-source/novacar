/**
 * Presentation · Page · QuoteRequestsAdminPage
 * Bandeja de cotizaciones/consultas enviadas desde el sitio público:
 * importación de auto (ImportQuoteModal) y solicitud de info de autoparte
 * (ProductInquiryModal). El admin las revisa y actualiza su estado.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, CalendarCheck, MessageSquareText, Trash2 } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { formatCurrency } from "@core/format/formatters";
import { Badge } from "@ui/atoms/Badge";
import { Skeleton } from "@ui/atoms/Skeleton";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { useQuoteRequestStore } from "../store/useQuoteRequestStore";
import type { QuoteRequest, QuoteStatus } from "../../domain/entities/QuoteRequest";

type SourceFilter = "all" | "import" | "inquiry" | "test_drive";

const SOURCE_ICON = {
  import: Car,
  inquiry: MessageSquareText,
  test_drive: CalendarCheck,
} as const;

const STATUS_TONE: Record<QuoteStatus, "neon" | "low" | "in"> = {
  new: "neon",
  contacted: "low",
  closed: "in",
};

export function QuoteRequestsAdminPage() {
  const { t, locale } = useTranslation();
  const toast = useToast();
  const { requests, loading, load, updateStatus, remove } = useQuoteRequestStore();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (sourceFilter === "all" ? requests : requests.filter((r) => r.source === sourceFilter)),
    [requests, sourceFilter],
  );

  async function handleDelete(request: QuoteRequest) {
    if (!window.confirm(t("admin.quoteDeleteConfirm"))) return;
    await remove(request.id);
    toast.success(t("admin.quoteDeleteSuccess"));
  }

  if (loading && requests.length === 0) return <Skeleton height={320} />;

  const columns: Column<QuoteRequest>[] = [
    {
      key: "source",
      header: t("admin.quoteColSource"),
      render: (r) => {
        const SourceIcon = SOURCE_ICON[r.source];
        const label =
          r.source === "import"
            ? t("admin.quoteSourceImport")
            : r.source === "test_drive"
              ? t("admin.quoteSourceTestDrive")
              : t("admin.quoteSourceInquiry");
        return (
          <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)" }}>
            <SourceIcon size={16} strokeWidth={1.75} aria-hidden />
            {label}
          </span>
        );
      },
    },
    {
      key: "subject",
      header: t("admin.quoteColSubject"),
      render: (r) => (
        <div style={{ minWidth: 0 }}>
          <strong>{r.subject}</strong>
          <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{r.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "details",
      header: t("admin.quoteColDetails"),
      render: (r) => (
        <span style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>
          {r.amount != null ? `${formatCurrency(r.amount, locale)} · ` : ""}
          {r.details}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("admin.quoteColDate"),
      render: (r) => (
        <span style={{ color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
          {new Date(r.createdAt).toLocaleString(locale === "es" ? "es-MX" : "en-US", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: t("admin.colStatus"),
      render: (r) => (
        <label className="admin-quote-status" style={{ display: "inline-flex" }}>
          <Badge tone={STATUS_TONE[r.status]}>
            <select
              value={r.status}
              onChange={(e) => updateStatus(r.id, e.target.value as QuoteStatus)}
              aria-label={t("admin.colStatus")}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                fontWeight: 700,
                fontSize: "inherit",
              }}
            >
              <option value="new">{t("admin.quoteStatusNew")}</option>
              <option value="contacted">{t("admin.quoteStatusContacted")}</option>
              <option value="closed">{t("admin.quoteStatusClosed")}</option>
            </select>
          </Badge>
        </label>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="admin-row-actions">
          <button
            type="button"
            className="admin-iconBtn admin-iconBtn--danger"
            onClick={() => handleDelete(r)}
            aria-label={t("common.delete")}
          >
            <Trash2 size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.quotes")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            {t("admin.quotesSubtitle")}
          </p>
        </div>
      </div>

      <div className="admin-subtabs">
        <button
          type="button"
          className={`admin-subtabs__item ${sourceFilter === "all" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSourceFilter("all")}
        >
          {t("admin.quoteFilterAll")}
        </button>
        <button
          type="button"
          className={`admin-subtabs__item ${sourceFilter === "import" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSourceFilter("import")}
        >
          {t("admin.quoteSourceImport")}
        </button>
        <button
          type="button"
          className={`admin-subtabs__item ${sourceFilter === "inquiry" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSourceFilter("inquiry")}
        >
          {t("admin.quoteSourceInquiry")}
        </button>
        <button
          type="button"
          className={`admin-subtabs__item ${sourceFilter === "test_drive" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSourceFilter("test_drive")}
        >
          {t("admin.quoteSourceTestDrive")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>{t("admin.quotesEmpty")}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} />
      )}
    </div>
  );
}
