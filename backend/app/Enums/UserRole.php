<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/**
 * Rol de una cuenta. El frontend replica exactamente estos valores
 * (core/auth/types.ts, tipo UserRole).
 */
enum UserRole: string
{
    use HasValues;

    case Admin = 'admin';
    case Operator = 'operator';
    case Customer = 'customer';

    /** Puede entrar al panel administrativo (rutas /admin). */
    public function isStaff(): bool
    {
        return match ($this) {
            self::Admin, self::Operator => true,
            self::Customer => false,
        };
    }

    /** Puede realizar operaciones destructivas o de configuración global. */
    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrador',
            self::Operator => 'Operador',
            self::Customer => 'Cliente',
        };
    }
}
