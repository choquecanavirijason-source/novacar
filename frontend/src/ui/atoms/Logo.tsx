/**
 * Atom · Logo
 * Wordmark de NOVACAR.
 */

import Link from "next/link";

export function Logo({ size = "1.2rem", suffix }: { size?: string; suffix?: string }) {
  return (
    <Link href="/" style={{ fontWeight: 900, fontSize: size, letterSpacing: "-0.01em", color: "#fff" }}>
      NOVACAR
      {suffix && <span style={{ color: "var(--text-muted)", fontWeight: 700 }}> {suffix}</span>}
    </Link>
  );
}
