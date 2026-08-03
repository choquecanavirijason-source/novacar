/**
 * Data · Model · BannerDTO
 * Forma cruda tal como viajaría por la API (snake_case).
 */

export interface BannerDTO {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_label: string;
  href: string;
  accent_from: string;
  accent_to: string;
  active: boolean;
  order: number;
}
