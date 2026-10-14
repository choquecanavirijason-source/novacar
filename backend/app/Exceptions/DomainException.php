<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

/**
 * Raíz de todos los errores de negocio.
 *
 * Los servicios lanzan estas excepciones en lugar de devolver `null`/`false`:
 * así el controlador no tiene que interpretar valores centinela y la respuesta
 * HTTP queda definida por el propio error, no por el punto donde se detectó.
 *
 * Laravel invoca `render()` automáticamente, de modo que no hace falta un
 * try/catch por acción para obtener un JSON coherente.
 */
abstract class DomainException extends RuntimeException
{
    /**
     * @param  array<string, mixed>  $context  Datos extra para el cliente y los logs.
     */
    public function __construct(
        string $message,
        private readonly array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    /** Código HTTP semántico con el que debe responder la API. */
    abstract public function statusCode(): int;

    /** Identificador estable y legible por máquina (`vehicle_not_found`). */
    abstract public function errorCode(): string;

    /**
     * @return array<string, mixed>
     */
    public function context(): array
    {
        return $this->context;
    }

    /**
     * Contrato de error único para toda la API.
     */
    public function render(Request $request): JsonResponse
    {
        return response()->json(array_filter([
            'message' => $this->getMessage(),
            'error_code' => $this->errorCode(),
            'context' => $this->context() === [] ? null : $this->context(),
        ], static fn (mixed $value): bool => $value !== null), $this->statusCode());
    }
}
