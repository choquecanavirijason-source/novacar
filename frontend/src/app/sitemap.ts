/**
 * App Router · sitemap.ts
 * Genera /sitemap.xml automáticamente: rutas estáticas públicas + una entrada
 * por cada auto y autoparte reales (mock o API, según NEXT_PUBLIC_USE_API).
 * Excluye /login y /admin (no son contenido público indexable).
 */

import type { MetadataRoute } from "next";
import { catalogUseCases } from "@features/vehicles_catalog/di";
import { marketplaceUseCases } from "@features/parts_marketplace/di";
import { emptyFilters } from "@features/parts_marketplace/domain/entities/PartFilters";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://novacar.mx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/autopartes`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/buscador`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/importaciones`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const [vehicles, parts] = await Promise.all([
    catalogUseCases.filterVehicles.execute({}),
    marketplaceUseCases.searchParts.execute(emptyFilters()),
  ]);

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${BASE_URL}/catalogo/${v.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const partRoutes: MetadataRoute.Sitemap = parts.map((p) => ({
    url: `${BASE_URL}/autopartes/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...partRoutes];
}
