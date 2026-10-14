<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * Una invariante del negocio impide completar la operación aunque el payload
 * sea sintácticamente válido (por eso 422 y no 400).
 */
class BusinessRuleViolationException extends DomainException
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        string $message,
        private readonly string $rule = 'business_rule_violated',
        array $context = [],
    ) {
        parent::__construct($message, $context);
    }

    public static function invalidStatusTransition(string $from, string $to): self
    {
        return new self(
            "No se puede pasar del estado \"{$from}\" a \"{$to}\".",
            'invalid_status_transition',
            ['from' => $from, 'to' => $to],
        );
    }

    public static function newVehicleCannotHaveMileage(): self
    {
        return new self(
            'Un vehículo declarado como nuevo no puede registrar kilometraje.',
            'new_vehicle_with_mileage',
        );
    }

    public static function warrantyExceedsConditionLimit(string $condition, int $max): self
    {
        return new self(
            "Una pieza en condición \"{$condition}\" admite como máximo {$max} meses de garantía.",
            'warranty_exceeds_condition_limit',
            ['condition' => $condition, 'max_warranty_months' => $max],
        );
    }

    public static function invalidYearRange(int $from, int $to): self
    {
        return new self(
            "El rango de años es inválido: {$from} es posterior a {$to}.",
            'invalid_year_range',
            ['year_from' => $from, 'year_to' => $to],
        );
    }

    public function statusCode(): int
    {
        return 422;
    }

    public function errorCode(): string
    {
        return $this->rule;
    }
}
