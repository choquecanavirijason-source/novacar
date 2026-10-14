<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Cuenta del sistema. Un mismo modelo cubre al cliente del sitio público y al
 * personal del panel; los separa el enum `role`.
 *
 * @property int $id
 * @property UserRole $role
 * @property string|null $phone
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens;

    use HasFactory;
    use Notifiable;

    /**
     * Configuración explícita: `role` es asignable en masa solo porque los
     * servicios lo fijan a partir de reglas de negocio, nunca desde el request
     * público (el RegisterRequest no acepta ese campo).
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'last_login_at',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    /** Banners dados de alta por esta cuenta. */
    public function banners(): HasMany
    {
        return $this->hasMany(Banner::class, 'created_by');
    }

    /** Cotizaciones que este operador atendió. */
    public function handledQuoteRequests(): HasMany
    {
        return $this->hasMany(QuoteRequest::class, 'handled_by');
    }

    /** Atajo de dominio: delega la regla en el enum, no la duplica. */
    public function isStaff(): bool
    {
        return $this->role->isStaff();
    }

    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }

    /** Solo cuentas con acceso al panel. */
    public function scopeStaff(Builder $query): Builder
    {
        return $query->whereIn('role', [UserRole::Admin, UserRole::Operator]);
    }

    public function scopeOfRole(Builder $query, UserRole $role): Builder
    {
        return $query->where('role', $role);
    }
}
