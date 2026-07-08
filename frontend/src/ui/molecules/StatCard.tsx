/**
 * Molecule · StatCard
 * Tarjeta de métrica (KPI) reutilizable: label + valor + icono + acento + hint.
 * Usada en el panel admin y en secciones de estadísticas.
 */

import { Card } from "../atoms/Card";

type Accent = "primary" | "neon" | "danger" | "success";

const ACCENTS: Record<Accent, string> = {
  primary: "var(--primary-glow)",
  neon: "var(--accent-neon)",
  danger: "var(--danger)",
  success: "var(--success)",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  hint?: string;
  accent?: Accent;
}

export function StatCard({ label, value, icon, hint, accent = "primary" }: StatCardProps) {
  const color = ACCENTS[accent];
  return (
    <Card animate style={{ padding: 20, position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 80% at 100% 0%, ${color}22, transparent 60%)`,
        }}
      />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.84rem" }}>{label}</span>
          {icon && <span style={{ fontSize: "1.2rem" }}>{icon}</span>}
        </div>
        <div style={{ fontSize: "1.9rem", fontWeight: 800, color, marginTop: 8 }}>{value}</div>
        {hint && (
          <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>{hint}</div>
        )}
      </div>
    </Card>
  );
}
