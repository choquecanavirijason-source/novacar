<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * Choca con un registro existente en una clave única de negocio.
 */
final class DuplicateResourceException extends DomainException
{
    private function __construct(
        string $message,
        private readonly string $code,
        array $context = [],
    ) {
        parent::__construct($message, $context);
    }

    public static function sku(string $sku): self
    {
        return new self("Ya existe una autoparte con el SKU {$sku}.", 'duplicate_sku', ['sku' => $sku]);
    }

    public static function email(string $email): self
    {
        return new self("El correo {$email} ya está registrado.", 'duplicate_email', ['email' => $email]);
    }

    public function statusCode(): int
    {
        return 409;
    }

    public function errorCode(): string
    {
        return $this->code;
    }
}
