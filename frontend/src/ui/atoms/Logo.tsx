/**
 * Atom · Logo
 * Wordmark de NOVACAR.
 */

import Link from "next/link";

export function Logo({ size = "1.2rem", suffix }: { size?: string; suffix?: string }) {
  return (
    <Link
      href="/"
      className="text-gradient"
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.03em",
      }}
    >
      NOVACAR
      {suffix && (
        <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
          {" "}
          {suffix}
        </span>
      )}
    </Link>
  );
}
