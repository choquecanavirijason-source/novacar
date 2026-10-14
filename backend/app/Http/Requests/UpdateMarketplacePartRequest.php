<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\MarketplacePart;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

/**
 * Edición de autoparte (`PUT /api/admin/marketplace/parts/{part}`).
 *
 * Única diferencia real con el alta: la unicidad del SKU ignora la propia fila,
 * de modo que guardar sin cambiar el SKU no dispara un falso duplicado.
 */
class UpdateMarketplacePartRequest extends StoreMarketplacePartRequest
{
    protected function skuUniqueRule(): Unique
    {
        return Rule::unique(MarketplacePart::class, 'sku')
            ->ignore($this->route('part'), 'id')
            ->whereNull('deleted_at');
    }
}
