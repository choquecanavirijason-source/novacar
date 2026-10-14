<?php

declare(strict_types=1);

namespace App\Http\Requests;

/**
 * Edición de banner (`PUT /api/admin/banners/{banner}`). El frontend envía el
 * objeto completo, por lo que aplica el mismo conjunto de reglas del alta.
 */
class UpdateBannerRequest extends StoreBannerRequest
{
}
