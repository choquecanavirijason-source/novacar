/**
 * App Router · Detalle de auto (/catalogo/[id])
 * Server Component: resuelve el vehículo vía use case y lo renderiza.
 */

import { notFound } from "next/navigation";
import { catalogUseCases } from "@features/vehicles_catalog/di";
import { VehicleDetail } from "@features/vehicles_catalog/presentation/pages/VehicleDetail";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await catalogUseCases.getVehicleById.execute(id);

  if (!vehicle) notFound();

  return <VehicleDetail vehicle={vehicle} />;
}
