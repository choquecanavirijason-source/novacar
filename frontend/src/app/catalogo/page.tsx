/**
 * App Router · Catálogo de autos (/catalogo)
 * Explorador con filtros reactivos del módulo vehicles_catalog (header traducido incluido).
 */

import { CatalogExplorer } from "@features/vehicles_catalog/presentation/pages/CatalogExplorer";

export const metadata = {
  title: "Catálogo de autos · AutoDrive",
  description: "Explora autos nuevos y seminuevos con filtros inteligentes.",
};

export default function CatalogoPage() {
  return <CatalogExplorer />;
}
