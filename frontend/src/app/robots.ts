/**
 * App Router · robots.ts
 * Genera /robots.txt: permite indexar el sitio público, bloquea /admin y
 * /login (panel interno, no es contenido para buscadores), y enlaza el sitemap.
 */

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://novacar.mx";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
