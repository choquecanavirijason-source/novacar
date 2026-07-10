/**
 * App Router · Root Layout
 * Importa el sistema de diseño global (:root) y monta el contexto de idioma (i18n)
 * junto con los organisms globales Navbar y Footer (Atomic Design).
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import localFont from "next/font/local";
import "@theme/globals.css";
import "@ui/templates/templates.css";
import { I18nProvider } from "@core/i18n/I18nProvider";
import { AuthProvider } from "@core/auth/AuthProvider";
import { ToastProvider } from "@core/toast/ToastProvider";
import { SkipLink } from "@ui/atoms/SkipLink";
import { Navbar } from "@ui/organisms/Navbar";
import { UserTopPanel } from "@ui/organisms/UserTopPanel";
import { Footer } from "@ui/organisms/Footer";

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
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${okomito.variable}`}>
      <body>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <SkipLink />
              <Navbar />
              <Suspense fallback={null}>
                <UserTopPanel />
              </Suspense>
              <main
                id="main-content"
                tabIndex={-1}
                className="container"
                style={{ minHeight: "calc(100vh - 72px)", outline: "none" }}
              >
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}