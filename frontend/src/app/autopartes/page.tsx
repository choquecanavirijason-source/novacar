/**
 * App Router · Marketplace de autopartes (/autopartes)
 */

import { PartsMarketplace } from "@features/parts_marketplace/presentation/pages/PartsMarketplace";

export const metadata = {
  title: "Autopartes · AutoDrive",
  description: "Marketplace de refacciones: motores, llantas, asientos, baterías y más.",
};

export default function AutopartesPage() {
  return <PartsMarketplace />;
}
