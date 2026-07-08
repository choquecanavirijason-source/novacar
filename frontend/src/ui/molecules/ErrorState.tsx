/**
 * Molecule · ErrorState
 * Estado de error con mensaje y reintento opcional.
 */

import type { ReactNode } from "react";
import { Badge } from "../atoms/Badge";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  message,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`tpl-error ${className}`.trim()} role="alert">
      <div className="tpl-error__icon" aria-hidden="true">
        <Badge tone="out">{title ?? "Error"}</Badge>
      </div>
      <p className="tpl-error__message">{message}</p>
      {action && <div className="tpl-error__action">{action}</div>}
    </div>
  );
}