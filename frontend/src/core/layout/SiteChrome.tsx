/**
 * Core · Layout · SiteChrome
 * Envuelve el árbol de la app: en rutas públicas monta Navbar/UserTopPanel/Footer
 * dentro del container global; en /admin renderiza un shell propio, sin el
 * menú ni el footer del sitio, para que el panel se sienta como un producto aparte.
 */

"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@core/motion/PageTransition";
import { Navbar } from "@ui/organisms/Navbar";
import { Footer } from "@ui/organisms/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return (
      <div className="admin-shell">
        <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="container"
        style={{ outline: "none" }}
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
