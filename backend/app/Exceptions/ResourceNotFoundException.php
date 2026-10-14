<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * El recurso solicitado no existe (o fue borrado lógicamente).
 */
final class ResourceNotFoundException extends DomainException
{
    private function __construct(
        string $message,
        private readonly string $resource,
        array $context = [],
    ) {
        parent::__construct($message, $context);
    }

    public static function vehicle(string $id): self
    {
        return new self("El vehículo {$id} no existe.", 'vehicle', ['id' => $id]);
    }

    public static function part(string $id): self
    {
        return new self("La autoparte {$id} no existe.", 'part', ['id' => $id]);
    }

    public static function banner(string $id): self
    {
        return new self("El banner {$id} no existe.", 'banner', ['id' => $id]);
    }

    public static function quoteRequest(string $id): self
    {
        return new self("La cotización {$id} no existe.", 'quote_request', ['id' => $id]);
    }

    public static function inventoryItem(string $id): self
    {
        return new self("El ítem de inventario {$id} no existe.", 'inventory_item', ['id' => $id]);
    }

    public function statusCode(): int
    {
        return 404;
    }

    public function errorCode(): string
    {
        return "{$this->resource}_not_found";
    }
}
