<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Banner;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Un banner se encendió o apagó desde la tabla del panel.
 */
final class BannerVisibilityChanged
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public readonly Banner $banner,
        public readonly bool $active,
    ) {}
}
