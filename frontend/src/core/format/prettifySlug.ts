/**
 * Core · Format · prettifySlug
 * "wiper-blades" -> "Wiper Blades". Fallback de display para valores que el
 * admin escribió a mano (categorías custom) y no tienen traducción fija.
 */

export function prettifySlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
