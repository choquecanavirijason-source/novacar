<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * Un ajuste dejaría el inventario en negativo.
 */
final class InsufficientStockException extends BusinessRuleViolationException
{
    public function __construct(
        private readonly string $partId,
        private readonly int $available,
        private readonly int $requested,
    ) {
        parent::__construct(
            "Stock insuficiente para {$partId}: hay {$available} unidades y se solicitaron {$requested}.",
            'insufficient_stock',
            ['part_id' => $partId, 'available' => $available, 'requested' => $requested],
        );
    }

    public function partId(): string
    {
        return $this->partId;
    }

    public function available(): int
    {
        return $this->available;
    }

    public function requested(): int
    {
        return $this->requested;
    }
}
