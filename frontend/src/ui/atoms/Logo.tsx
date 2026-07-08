/**
 * Atom · Logo
 * Wordmark de AutoDrive.
 */

import Link from "next/link";

export function Logo({ size = "1.2rem", suffix }: { size?: string; suffix?: string }) {
  return (
    <Link href="/" style={{ fontWeight: 900, fontSize: size, letterSpacing: "-0.01em" }}>
      Auto<span style={{ color: "var(--accent-neon)" }}>Drive</span>
      {suffix && <span style={{ color: "var(--text-muted)", fontWeight: 700 }}> {suffix}</span>}
    </Link>
  );
}
