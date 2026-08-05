/**
 * Presentation · Page · InventoryPage
 * Sub-pestañas: "Piezas" (InventoryItem: stock/precio simple) y "Autopartes"
 * (MarketplacePart: lo que se publica en /autopartes, con condición, rating,
 * garantía, compatibilidad). Mismo lenguaje visual en ambas tablas.
 */

"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdminDashboardStore } from "../store/useAdminDashboardStore";
import { DataTable, type Column } from "@ui/organisms/DataTable";
import { AddPartModal } from "../components/AddPartModal";
import { isLowStock, type InventoryItem, type NewInventoryItem } from "../../domain/entities/InventoryItem";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Skeleton } from "@ui/atoms/Skeleton";
import { Button } from "@ui/atoms/Button";
import { Badge } from "@ui/atoms/Badge";
import { MarketplacePartsAdminPage, type MarketplacePart } from "@features/parts_marketplace";
import { prettifySlug } from "@core/format/prettifySlug";

type SubTab = "parts" | "marketplace";

export function InventoryPage() {
  const { t, locale } = useTranslation();
  const { inventory, loading, updateStock, addItem, updateItem, removeItem } = useAdminDashboardStore();
  const [modalItem, setModalItem] = useState<InventoryItem | "new" | null>(null);
  const [modalPart, setModalPart] = useState<MarketplacePart | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [subTab, setSubTab] = useState<SubTab>("parts");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter(
      (r) => r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q),
    );
  }, [inventory, query]);

  async function handleSubmit(input: NewInventoryItem) {
    if (modalItem === "new") return addItem(input);
    if (modalItem) return updateItem(modalItem.id, input);
    return false;
  }

  async function handleDelete(item: InventoryItem) {
    if (!window.confirm(t("admin.itemDeleteConfirm"))) return;
    await removeItem(item.id);
  }

  const knownCategoryLabel: Record<string, string> = {
    battery: t("admin.categoryBattery"),
    fuse: t("admin.categoryFuse"),
  };
  const categoryLabel = (cat: string) => knownCategoryLabel[cat] ?? prettifySlug(cat);

  const columns: Column<InventoryItem>[] = [
    {
      key: "product",
      header: t("admin.colProduct"),
      render: (r) => (
        <div>
          <strong>{r.name}</strong>
          <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{r.sku}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("admin.colType"),
      render: (r) => <span style={{ color: "var(--text-secondary)" }}>{categoryLabel(r.category)}</span>,
    },
    { key: "price", header: t("admin.colPrice"), align: "right", render: (r) => formatCurrency(r.price, locale) },
    {
      key: "status",
      header: t("admin.colStatus"),
      render: (r) => (
        <Badge tone={isLowStock(r) ? "low" : "in"}>
          {isLowStock(r) ? t("admin.statusLow") : t("admin.statusOk")}
        </Badge>
      ),
    },
    {
      key: "stock",
      header: t("admin.colStock"),
      align: "right",
      render: (r) => (
        <input
          type="number"
          min={0}
          className="admin-stock-input"
          defaultValue={r.stock}
          onBlur={(e) => {
            const v = Number(e.target.value);
            if (v !== r.stock) void updateStock(r.id, v);
          }}
          style={{
            width: 80,
            textAlign: "right",
            padding: "8px 4px",
            border: "none",
            background: "transparent",
            fontWeight: 700,
            color: isLowStock(r) ? "var(--danger)" : "var(--accent-neon)",
          }}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="admin-row-actions">
          <button type="button" className="admin-iconBtn" onClick={() => setModalItem(r)} aria-label={t("common.edit")}>
            <Pencil size={15} strokeWidth={1.75} aria-hidden />
          </button>
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
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.inventory")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            {t("admin.inventorySubtitle")}
          </p>
        </div>
        <Button size="sm" onClick={() => (subTab === "parts" ? setModalItem("new") : setModalPart("new"))}>
          <Plus size={15} strokeWidth={2.25} aria-hidden />
          {subTab === "parts" ? t("admin.addPart") : t("admin.partAdd")}
        </Button>
      </div>

      <div className="admin-subtabs">
        <button
          type="button"
          className={`admin-subtabs__item ${subTab === "parts" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSubTab("parts")}
        >
          {t("admin.inventoryTabParts")}
        </button>
        <button
          type="button"
          className={`admin-subtabs__item ${subTab === "marketplace" ? "admin-subtabs__item--active" : ""}`}
          onClick={() => setSubTab("marketplace")}
        >
          {t("admin.inventoryTabMarketplace")}
        </button>
      </div>

      {subTab === "marketplace" ? (
        <MarketplacePartsAdminPage
          modalPart={modalPart}
          onOpenEdit={setModalPart}
          onCloseModal={() => setModalPart(null)}
        />
      ) : loading ? (
        <Skeleton height={320} />
      ) : (
        <>
          <label className="admin-search">
            <Search size={16} strokeWidth={1.75} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("admin.searchInventory")}
              aria-label={t("admin.searchInventory")}
            />
          </label>

          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "24px 0" }}>{t("admin.searchEmpty")}</p>
          ) : (
            <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} />
          )}

          {modalItem && (
            <AddPartModal
              item={modalItem === "new" ? undefined : modalItem}
              onClose={() => setModalItem(null)}
              onSubmit={handleSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}
