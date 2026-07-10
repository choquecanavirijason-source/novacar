/**
 * Presentation · Component · VehicleFinderBar
 * Barra de búsqueda (Premium Dark UI) justo debajo del Hero, con margen
 * positivo normal (sin superponerse al Hero — el margen negativo usado antes
 * causaba que la barra se montara sobre el Hero en pantallas grandes).
 * Filtra por marca / carrocería / presupuesto y navega a /catalogo aplicando
 * esos filtros en el store compartido (mismo store que usa CatalogExplorer).
 */

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { BodyType, CatalogFilterOptions } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";
import { useCatalogStore } from "../store/useCatalogStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { formatCurrency } from "@core/format/formatters";
import { bodyTypeKey } from "../vehiclePresentation";

export function VehicleFinderBar() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const setFilters = useCatalogStore((s) => s.setFilters);
  const [options, setOptions] = useState<CatalogFilterOptions | null>(null);
  const [brand, setBrand] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    void catalogUseCases.filterVehicles.getOptions().then(setOptions);
  }, []);

  const priceTiers = options
    ? [0.35, 0.65, 1].map(
        (f) => Math.round((options.priceRange.min + (options.priceRange.max - options.priceRange.min) * f) / 50000) * 50000,
      )
    : [];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void setFilters({
      brand: brand || undefined,
      bodyType: (bodyType || undefined) as BodyType | undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
    router.push("/catalogo");
  }

  return (
    <div className="relative z-20 mt-10 px-4 pb-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex flex-col gap-4 rounded-(--radius-btn) border border-white/10 bg-(--bg-surface) p-5 shadow-2xl sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("catalog.brand")}
          </span>
          <select
            className="rounded-(--radius-btn) border border-white/10 bg-(--bg-base) px-3 py-2.5 text-sm text-white outline-none focus:border-(--accent-neon)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">{t("common.any")}</option>
            {options?.brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("catalog.body")}
          </span>
          <select
            className="rounded-(--radius-btn) border border-white/10 bg-(--bg-base) px-3 py-2.5 text-sm text-white outline-none focus:border-(--accent-neon)"
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
          >
            <option value="">{t("common.any")}</option>
            {options?.bodyTypes.map((b) => (
              <option key={b} value={b}>
                {t(bodyTypeKey[b])}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("catalog.maxPrice")}
          </span>
          <select
            className="rounded-(--radius-btn) border border-white/10 bg-(--bg-base) px-3 py-2.5 text-sm text-white outline-none focus:border-(--accent-neon)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            <option value="">{t("common.any")}</option>
            {priceTiers.map((tier) => (
              <option key={tier} value={tier}>
                {formatCurrency(tier, locale)}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="relative overflow-hidden rounded-(--radius-btn) bg-(--accent-neon) px-7 py-2.5 text-sm font-bold text-black transform-[skewX(-12deg)] transition-transform duration-300 hover:scale-[1.02]"
        >
          <span
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 via-white/10 to-black/15"
            aria-hidden
          />
          <span className="relative flex items-center justify-center gap-2 transform-[skewX(12deg)]">
            <Search size={16} strokeWidth={2} aria-hidden />
            {t("common.search")}
          </span>
        </button>
      </form>
    </div>
  );
}
