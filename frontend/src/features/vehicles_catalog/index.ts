/**
 * Barrel público del feature `vehicles_catalog`.
 * Otros features importan SOLO desde acá — nunca de sus rutas internas
 * (`domain/`, `data/`, `presentation/...`), según la regla de arquitectura
 * del proyecto (ver skill `autodrive-architecture`).
 */

export { VehiclesAdminPage } from "./presentation/pages/VehiclesAdminPage";
export { DiscountBanners } from "./presentation/components/DiscountBanners";
export { useVehicleAdminStore } from "./presentation/store/useVehicleAdminStore";
export { catalogUseCases } from "./di";
export type { CatalogVehicle, NewCatalogVehicle } from "./domain/entities/CatalogVehicle";
