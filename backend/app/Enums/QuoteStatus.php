<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Ciclo de vida de una cotización dentro de la bandeja del panel. */
enum QuoteStatus: string
{
    use HasValues;

    case New = 'new';
    case Contacted = 'contacted';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::New => 'Nueva',
            self::Contacted => 'Contactado',
            self::Closed => 'Cerrada',
        };
    }

    /**
     * Transiciones permitidas. Una cotización cerrada puede reabrirse a
     * contactada, pero nunca vuelve al estado inicial.
     *
     * @return list<self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::New => [self::Contacted, self::Closed],
            self::Contacted => [self::Closed],
            self::Closed => [self::Contacted],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return $target === $this || in_array($target, $this->allowedTransitions(), true);
    }
}
