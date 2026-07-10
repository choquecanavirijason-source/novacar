/**
 * Molecule · Pagination
 * Controles de paginación numerada (con elipsis para rangos largos) +
 * flechas prev/next. No se renderiza si solo hay una página.
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPageWindow(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} strokeWidth={2} aria-hidden />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} strokeWidth={2} aria-hidden />
      </button>
    </nav>
  );
}
