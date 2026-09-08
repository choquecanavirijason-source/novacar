/**
 * App Router · Root Layout
 * Importa el sistema de diseño global (:root) y monta el contexto de idioma (i18n)
 * junto con los organisms globales Navbar y Footer (Atomic Design).
 */

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import localFont from "next/font/local";
import "@theme/globals.css";
import "@ui/templates/templates.css";
import { I18nProvider } from "@core/i18n/I18nProvider";
import { AuthProvider } from "@core/auth/AuthProvider";
import { ToastProvider } from "@core/toast/ToastProvider";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@core/theme/ThemeProvider";
import { SmoothScroll } from "@core/motion/SmoothScroll";
import { SiteChrome } from "@core/layout/SiteChrome";
import { SkipLink } from "@ui/atoms/SkipLink";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/** Fuente de marca (títulos/logo): archivo local agregado en public/fonts. */
const okomito = localFont({
  src: "../../public/fonts/Okomito Medium/Okomito-Medium.ttf",
  weight: "500",
  style: "normal",
  variable: "--font-okomito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVACAR · Autos y autopartes compatibles",
  description:
    "Plataforma de venta de autos y autopartes (baterías y fusibles) con buscador inteligente de compatibilidad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${inter.variable} ${okomito.variable}`}
      // El script inline de abajo escribe data-theme en <html> antes del
      // primer paint (para no flashear); React no debe pelear por ese
      // atributo al hidratar, ver core/theme/ThemeProvider.tsx.
      suppressHydrationWarning
    >
      <head>
        {/* Aplica el tema guardado antes del primer paint: evita el flash
            claro→oscuro al recargar con "oscuro" seleccionado. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <ToastProvider>
                <SmoothScroll />
                <div className="grain-overlay" aria-hidden />
                <SkipLink />
                <SiteChrome>{children}</SiteChrome>
              </ToastProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}