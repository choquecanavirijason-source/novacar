/**
 * Template · CollectionView
 * Grid de colección con estados loading, empty y error integrados.
 */

import type { ReactNode } from "react";
import { Skeleton } from "../atoms/Skeleton";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { ErrorState } from "../molecules/ErrorState";

type GridVariant = "cards" | "tiles";

interface CollectionViewProps<T> {
  items: T[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T) => string | number;
  emptyTitle: string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  skeletonCount?: number;
  skeletonHeight?: number;
  variant?: GridVariant;
  className?: string;
}

export function CollectionView<T>({
  items,
  loading,
  error,
  onRetry,
  retryLabel = "Reintentar",
  renderItem,
  getKey,
  emptyTitle,
  emptyMessage,
  emptyIcon,
  emptyAction,
  skeletonCount = 6,
  skeletonHeight = 320,
  variant = "cards",
  className = "",
}: CollectionViewProps<T>) {
  const gridClass = `tpl-grid tpl-grid--${variant} ${className}`.trim();

  if (error) {
    return (
      <ErrorState
        message={error}
        action={
          onRetry ? (
            <Button variant="ghost" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Cargando">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} height={skeletonHeight} radius="var(--radius-lg)" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        message={emptyMessage}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={gridClass} aria-live="polite">
      {items.map((item, i) => (
        <div key={getKey(item)}>{renderItem(item, i)}</div>
      ))}
    </div>
  );
}