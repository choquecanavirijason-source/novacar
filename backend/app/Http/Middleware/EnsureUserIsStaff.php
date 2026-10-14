<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cierra el panel a quien no sea administrador u operador.
 *
 * El guard del frontend es solo cosmético (redirige la vista); la autorización
 * real vive aquí: sin esto, un `customer` con token válido podría llamar a
 * `/api/admin/*` directamente.
 */
final class EnsureUserIsStaff
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return response()->json([
                'message' => 'Necesitas iniciar sesión.',
                'error_code' => 'unauthenticated',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (! $user->isStaff()) {
            return response()->json([
                'message' => 'Tu cuenta no tiene acceso al panel administrativo.',
                'error_code' => 'insufficient_role',
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
