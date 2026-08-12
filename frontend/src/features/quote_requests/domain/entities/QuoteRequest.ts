/**
 * Domain · Entity · QuoteRequest
 * Cotización/consulta enviada desde el sitio público (importación de auto o
 * información de una autoparte) que llega a la bandeja del panel admin.
 */

export type QuoteSource = "import" | "inquiry" | "test_drive";
export type QuoteStatus = "new" | "contacted" | "closed";

export interface QuoteRequest {
  readonly id: string;
  readonly source: QuoteSource;
  readonly customerEmail: string;
  readonly subject: string;
  readonly details: string;
  readonly amount: number | null;
  readonly status: QuoteStatus;
  readonly createdAt: string;
}

/** Datos que captura el formulario público al enviar una cotización/consulta. */
export type NewQuoteRequest = Omit<QuoteRequest, "id" | "createdAt" | "status">;
