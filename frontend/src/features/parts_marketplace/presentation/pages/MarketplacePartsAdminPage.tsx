/**
 * Presentation · Page · MarketplacePartsAdminPage
 * CRUD de autopartes del marketplace (sub-pestaña "Autopartes" dentro de
 * Inventario, panel admin). Misma tabla/estilo que Vehículos e Inventario.
 * El modal de alta/edición es controlado por el padre (`InventoryPage`) para
 * que el botón "+ Nueva autoparte" pueda vivir en su header, a la misma
 * altura que el título — sin efectos ni señales, prop directa.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { useToast } from "@core/toast/ToastProvider";
import { Badge } from "@ui/atoms/Badge";
import { Skeleton } from "@ui/atoms/Skeleton";
import { formatCurrency } from "@core/format/formatters";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { useMarketplacePartAdminStore } from "../store/useMarketplacePartAdminStore";
import { MarketplacePartFormModal } from "../components/MarketplacePartFormModal";
import { partPhotoUrl, resolveCategoryLabel } from "../partPresentation";
import type { MarketplacePart, NewMarketplacePart } from "../../domain/entities/MarketplacePart";

export function MarketplacePartsAdminPage({
  modalPart,
  onOpenEdit,
  onCloseModal,
}: {
  modalPart: MarketplacePart | "new" | null;
  onOpenEdit: (part: MarketplacePart) => void;
  onCloseModal: () => void;
}) {
  const { t, locale } = useTranslation();
  const toast = useToast();
  const { parts, loading, load, create, update, remove } = useMarketplacePartAdminStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
    );
  }, [parts, query]);

  async function handleSubmit(input: NewMarketplacePart) {
    if (modalPart === "new") return create(input);
    if (modalPart) return update(modalPart.id, input);
    return false;
  }

  async function handleDelete(part: MarketplacePart) {
    if (!window.confirm(t("admin.partDeleteConfirm"))) return;
    await remove(part.id);
    toast.success(t("admin.partDeleteSuccess"));
  }

  if (loading && parts.length === 0) return <Skeleton height={320} />;

  const columns: Column<MarketplacePart>[] = [
    {
      key: "part",
      header: t("admin.colProduct"),
      render: (p) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            className="admin-thumb"
            src={partPhotoUrl(p.id, p.category, { w: 128, h: 84 }, p.imageUrl)}
            alt=""
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div style={{ minWidth: 0 }}>
            <strong>{p.name}</strong>
            <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
              {p.sku} · {p.brand}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("admin.colType"),
      render: (p) => <span style={{ color: "var(--text-secondary)" }}>{resolveCategoryLabel(p.category, t)}</span>,
    },
    { key: "price", header: t("admin.colPrice"), align: "right", render: (p) => formatCurrency(p.price, locale) },
    {
      key: "stock",
      header: t("admin.colStock"),
      align: "right",
      render: (p) => (
        <Badge tone={p.stock <= 0 ? "out" : p.stock <= 5 ? "low" : "in"}>{p.stock}</Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <div className="admin-row-actions">
          <button type="button" className="admin-iconBtn" onClick={() => onOpenEdit(p)} aria-label={t("common.edit")}>
            <Pencil size={15} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            className="admin-iconBtn admin-iconBtn--danger"
            onClick={() => handleDelete(p)}
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
      <label className="admin-search">
        <Search size={16} strokeWidth={1.75} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.searchParts")}
          aria-label={t("admin.searchParts")}
        />
      </label>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>{t("admin.partsEmpty")}</p>
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} />
      )}

      {modalPart && (
        <MarketplacePartFormModal
          part={modalPart === "new" ? undefined : modalPart}
          onClose={onCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
