/**
 * Presentation · Component · TrustBar
 * Barra de confianza con 4 beneficios, estilo "Nodos Conectados": círculos
 * dorados con ícono lineal en negro, unidos por una línea con paradas.
 */

"use client";

import { Truck, Trophy, MessageCircle, RotateCcw } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { ConnectedNodes, type NodeItem } from "@ui";

const ICON_SIZE = { size: 26, strokeWidth: 1.75 } as const;

export function TrustBar() {
  const { t } = useTranslation();

  const items: NodeItem[] = [
    { icon: <Truck {...ICON_SIZE} aria-hidden />, title: t("trust.deliveryT"), description: t("trust.deliveryD") },
    { icon: <Trophy {...ICON_SIZE} aria-hidden />, title: t("trust.qualityT"), description: t("trust.qualityD") },
    { icon: <MessageCircle {...ICON_SIZE} aria-hidden />, title: t("trust.supportT"), description: t("trust.supportD") },
    { icon: <RotateCcw {...ICON_SIZE} aria-hidden />, title: t("trust.returnsT"), description: t("trust.returnsD") },
  ];

  return <ConnectedNodes items={items} />;
}
