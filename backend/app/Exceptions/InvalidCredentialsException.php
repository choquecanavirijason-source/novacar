<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * Credenciales incorrectas en el login. Mensaje deliberadamente genérico para
 * no revelar si el correo existe.
 */
final class InvalidCredentialsException extends DomainException
{
    public function __construct()
    {
        parent::__construct('Credenciales inválidas.');
    }

    public function statusCode(): int
    {
        return 401;
    }

    public function errorCode(): string
    {
        return 'invalid_credentials';
    }
}
