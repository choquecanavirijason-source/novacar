/**
 * App Router · Root Layout
 * Importa el sistema de diseño global (:root) y monta el contexto de idioma (i18n)
 * junto con los organisms globales Navbar y Footer (Atomic Design).
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import "@theme/globals.css";
import "@ui/templates/templates.css";
import { I18nProvider } from "@core/i18n/I18nProvider";
import { AuthProvider } from "@core/auth/AuthProvider";
import { Navbar } from "@ui/organisms/Navbar";
import { UserTopPanel } from "@ui/organisms/UserTopPanel";
import { Footer } from "@ui/organisms/Footer";

export const metadata: Metadata = {
  title: "NOVACAR · Autos y autopartes compatibles",
  description:
    "Plataforma de venta de autos y autopartes (baterías y fusibles) con buscador inteligente de compatibilidad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <Suspense fallback={null}>
              <UserTopPanel />
            </Suspense>
            <main className="container" style={{ minHeight: "calc(100vh - 72px)" }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}