/**
 * App Router · Buscador (/buscador)
 * Renderiza el buscador paso a paso del módulo search_vehicle_parts (header incluido).
 */

import { StepWizard } from "@features/search_vehicle_parts/presentation/pages/StepWizard";

export const metadata = {
  title: "Buscador de autopartes · NOVACAR",
  description: "Encuentra baterías y fusibles 100% compatibles con tu vehículo.",
};

export default function BuscadorPage() {
  return <StepWizard />;
}
