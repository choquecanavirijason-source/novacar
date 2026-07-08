/**
 * Presentation · Page · InventoryPage
 * Lista el inventario con edición de stock en línea (invoca UpdateInventoryStockUseCase).
 */

"use client";

import { useAdminDashboardStore } from "../store/useAdminDashboardStore";
import { DataTable, type Column } from "../components/DataTable";
import { isLowStock, type InventoryItem } from "../../domain/entities/InventoryItem";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Skeleton } from "@ui/atoms/Skeleton";

export function InventoryPage() {
  const { t } = useTranslation();
  const { inventory, loading, updateStock } = useAdminDashboardStore();

  if (loading) return <Skeleton height={320} />;

  const columns: Column<InventoryItem>[] = [
    { key: "sku", header: t("admin.colSku"), render: (r) => <code>{r.sku}</code> },
    { key: "name", header: t("admin.colProduct"), render: (r) => <strong>{r.name}</strong> },
    {
      key: "category",
      header: t("admin.colType"),
      render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.category}</span>,
    },
    { key: "price", header: t("admin.colPrice"), align: "right", render: (r) => formatCurrency(r.price) },
    {
      key: "stock",
      header: t("admin.colStock"),
      align: "right",
      render: (r) => (
        <input
          type="number"
          min={0}
          defaultValue={r.stock}
          onBlur={(e) => {
            const v = Number(e.target.value);
            if (v !== r.stock) void updateStock(r.id, v);
          }}
          style={{
            width: 80,
            textAlign: "right",
            padding: "8px 10px",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${isLowStock(r) ? "var(--danger)" : "var(--border-strong)"}`,
            background: "var(--bg-base)",
            color: isLowStock(r) ? "var(--danger)" : "var(--text-primary)",
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.inventory")}</h1>
      <DataTable columns={columns} rows={inventory} rowKey={(r) => r.id} />
    </div>
  );
}
