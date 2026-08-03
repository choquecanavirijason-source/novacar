/**
 * Presentation · Component · DataTable
 * Tabla genérica tipada para listados administrativos, con paginación
 * incorporada (misma tabla para Inventario, Vehículos, Autopartes, Banners).
 */

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Filas por página. Default 8. */
  pageSize?: number;
}

export function DataTable<T>({ columns, rows, rowKey, pageSize = 8 }: DataTableProps<T>) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

  // Si cambia el dataset (búsqueda, filtros, alta/baja) y la página actual
  // queda fuera de rango, volvemos a la primera.
  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align ?? "left",
                  padding: "14px 18px",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row) => (
            <tr key={rowKey(row)} style={{ transition: "var(--transition-fast)" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align ?? "left",
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.92rem",
                  }}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="admin-pagination">
          <span className="admin-pagination__info">
            {t("admin.paginationInfo", { page: safePage, total: pageCount })}
          </span>
          <div className="admin-pagination__controls">
            <button
              type="button"
              className="admin-iconBtn"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              aria-label={t("admin.paginationPrev")}
            >
              <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className="admin-iconBtn"
              disabled={safePage >= pageCount}
              onClick={() => setPage(safePage + 1)}
              aria-label={t("admin.paginationNext")}
            >
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
