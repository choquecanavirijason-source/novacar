/**
 * Data · DTO · MarketplacePartDTO
 * Forma de transporte (API/DB). Se traduce a MarketplacePart vía mapper.
 */

export interface MarketplacePartDTO {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  condition: string;
  price: number;
  discount_percent: number;
  stock: number;
  reorder_level: number;
  image_url?: string;
  rating: number;
  reviews: number;
  seller: string;
  free_shipping: boolean;
  warranty_months: number;
  compatible_brands: string[];
  year_from: number;
  year_to: number;
  specs: { label: string; value: string }[];
  accent_from: string;
  accent_to: string;
}
