/**
 * Data · Model · QuoteRequestDTO
 * Forma cruda tal como viajaría por la API (snake_case).
 */

export interface QuoteRequestDTO {
  id: string;
  source: "import" | "inquiry";
  customer_email: string;
  subject: string;
  details: string;
  amount: number | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}
