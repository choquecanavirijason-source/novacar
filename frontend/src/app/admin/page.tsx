/**
 * App Router · Panel administrativo (/admin)
 */

import { Suspense } from "react";
import { AdminDashboard } from "@features/admin_dashboard/presentation/components/AdminDashboard";
import { Skeleton } from "@ui/atoms/Skeleton";

export default function AdminPage() {
  return (
    <section className="admin-page">
      <Suspense
        fallback={
          <div style={{ display: "grid", gap: 16 }}>
            <Skeleton height={120} />
            <Skeleton height={320} />
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    </section>
  );
}