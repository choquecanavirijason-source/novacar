<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Alta de cuenta desde el formulario público.
 *
 * El rol no se acepta desde el request: se fuerza a `customer` salvo que un
 * administrador invoque el servicio explícitamente con otro rol.
 */
final readonly class RegisterUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
        public UserRole $role = UserRole::Customer,
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: trim((string) $data['name']),
            email: mb_strtolower(trim((string) $data['email'])),
            password: (string) $data['password'],
            phone: self::nullableString($data['phone'] ?? null),
        );
    }

    /** Variante con rol de personal, usada por seeders y comandos internos. */
    public function asStaff(UserRole $role): self
    {
        return new self($this->name, $this->email, $this->password, $this->phone, $role);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'role' => $this->role,
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }
}
