/**
 * Presentation · Page · InventoryPage
 * Piezas y autopartes en una sola vista (antes eran dos sub-pestañas
 * separadas — "Piezas" e "Autopartes" — sobre dos modelos distintos; ahora
 * comparten el modelo único MarketplacePart).
 */

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { MarketplacePartsAdminPage, type MarketplacePart } from "@features/parts_marketplace";

export function InventoryPage() {
  const { t } = useTranslation();
  const [modalPart, setModalPart] = useState<MarketplacePart | "new" | null>(null);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{t("admin.inventory")}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 4 }}>
            {t("admin.inventorySubtitle")}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalPart("new")}>
          <Plus size={15} strokeWidth={2.25} aria-hidden />
          {t("admin.partAdd")}
        </Button>
      </div>

      <MarketplacePartsAdminPage
        modalPart={modalPart}
        onOpenEdit={setModalPart}
        onCloseModal={() => setModalPart(null)}
      />
    </div>
  );
}
