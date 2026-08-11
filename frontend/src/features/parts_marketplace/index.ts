/**
 * Barrel público del feature `parts_marketplace`.
 * Otros features importan SOLO desde acá — nunca de sus rutas internas
 * (`domain/`, `data/`, `presentation/...`), según la regla de arquitectura
 * del proyecto (ver skill `autodrive-architecture`).
 */

export { MarketplacePartsAdminPage } from "./presentation/pages/MarketplacePartsAdminPage";
export { useMarketplacePartAdminStore } from "./presentation/store/useMarketplacePartAdminStore";
export { resolveCategoryLabel, resolveCategoryIcon } from "./presentation/partPresentation";
export { isLowStock, finalPrice } from "./domain/entities/MarketplacePart";
export type { MarketplacePart, NewMarketplacePart } from "./domain/entities/MarketplacePart";
