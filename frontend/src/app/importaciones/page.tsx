/**
 * App Router · Importaciones (/importaciones)
 */

import { ImportsPage } from "@features/vehicles_catalog/presentation/pages/ImportsPage";

export const metadata = {
  title: "Importaciones · NOVACAR",
  description: "Trae el auto de tus sueños desde el extranjero. Cotización automática de importación.",
};

export default function ImportacionesPage() {
  return <ImportsPage />;
}
