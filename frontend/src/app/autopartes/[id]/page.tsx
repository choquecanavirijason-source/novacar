/**
 * App Router · Detalle de autoparte (/autopartes/[id])
 */

import { notFound } from "next/navigation";
import { marketplaceUseCases } from "@features/parts_marketplace/di";
import { PartDetail } from "@features/parts_marketplace/presentation/pages/PartDetail";

export default async function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const part = await marketplaceUseCases.getPartById.execute(id);
  if (!part) notFound();
  return <PartDetail part={part} />;
}
