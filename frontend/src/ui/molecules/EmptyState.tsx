/**
 * Molecule · EmptyState
 * Estado vacío reutilizable con icono, título, mensaje y acción opcional.
 */

import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`tpl-empty ${className}`.trim()} role="status">
      {icon && <div className="tpl-empty__icon" aria-hidden="true">{icon}</div>}
      <strong className="tpl-empty__title">{title}</strong>
      {message && <p className="tpl-empty__message">{message}</p>}
      {action && <div className="tpl-empty__action">{action}</div>}
    </div>
  );
}