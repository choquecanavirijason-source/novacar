/**
 * Data · Model · AnalyticsSummaryDTO
 */

export interface AnalyticsSummaryDTO {
  stats: {
    total_vehicles: number;
    total_parts: number;
    low_stock_count: number;
    monthly_revenue: number;
  };
  top_selling_parts: { name: string; units: number }[];
}
