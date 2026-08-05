/**
 * Barrel público del feature `site_banners`.
 * Otros features importan SOLO desde acá — nunca de sus rutas internas
 * (`domain/`, `data/`, `presentation/...`), según la regla de arquitectura
 * del proyecto (ver skill `autodrive-architecture`).
 */

export { BannersPage } from "./presentation/pages/BannersPage";
export { useBannerStore } from "./presentation/store/useBannerStore";
export type { Banner, NewBanner } from "./domain/entities/Banner";
