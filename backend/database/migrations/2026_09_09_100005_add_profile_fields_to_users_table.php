<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * El registro público (`POST /auth/register`) captura teléfono, y el guard del
 * panel filtra por rol: ambos necesitan soporte en la tabla `users`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 32)->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->index('role', 'users_role_index');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex('users_role_index');
            $table->dropColumn(['phone', 'last_login_at']);
        });
    }
};
