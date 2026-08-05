/**
 * Barrel público del feature `quote_requests`.
 * Otros features importan SOLO desde acá — nunca de sus rutas internas
 * (`domain/`, `data/`, `presentation/...`), según la regla de arquitectura
 * del proyecto (ver skill `autodrive-architecture`).
 */

export { QuoteRequestsAdminPage } from "./presentation/pages/QuoteRequestsAdminPage";
export { useQuoteRequestStore } from "./presentation/store/useQuoteRequestStore";
export type { QuoteRequest, NewQuoteRequest, QuoteSource, QuoteStatus } from "./domain/entities/QuoteRequest";
