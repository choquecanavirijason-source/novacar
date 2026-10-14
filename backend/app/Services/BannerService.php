<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\BannerData;
use App\Events\BannerVisibilityChanged;
use App\Exceptions\ResourceNotFoundException;
use App\Models\Banner;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Reglas de negocio de los banners promocionales del home.
 *
 * La posición es responsabilidad exclusiva de este servicio: el alta va al
 * final de la lista y el reordenamiento reasigna posiciones consecutivas
 * dentro de una transacción, para que nunca queden huecos ni empates.
 */
final class BannerService
{
    /**
     * Todos los banners para la tabla del panel.
     *
     * @return Collection<int, Banner>
     */
    public function list(): Collection
    {
        return Banner::query()->ordered()->get();
    }

    /**
     * Solo los que debe pintar el home, ya ordenados.
     *
     * @return Collection<int, Banner>
     */
    public function activeForSite(): Collection
    {
        return Banner::query()->active()->ordered()->get();
    }

    public function findOrFail(string $id): Banner
    {
        $banner = Banner::query()->find($id);

        if ($banner === null) {
            throw ResourceNotFoundException::banner($id);
        }

        return $banner;
    }

    public function create(BannerData $data, ?User $author = null): Banner
    {
        return DB::transaction(function () use ($data, $author): Banner {
            // El alta se coloca al final: no reordena lo que el equipo ya definió.
            $highestPosition = Banner::query()->max('sort_order');

            return Banner::query()->create([
                ...$data->toArray(),
                'sort_order' => $highestPosition === null ? 0 : (int) $highestPosition + 1,
                'created_by' => $author?->id,
            ]);
        });
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function update(string $id, BannerData $data): Banner
    {
        $banner = $this->findOrFail($id);
        $wasActive = $banner->active;

        DB::transaction(static function () use ($banner, $data): void {
            $banner->fill($data->toArray());
            $banner->save();
        });

        $banner->refresh();

        if ($wasActive !== $banner->active) {
            BannerVisibilityChanged::dispatch($banner, $banner->active);
        }

        return $banner;
    }

    /**
     * Encendido/apagado desde la celda de la tabla.
     *
     * @throws ResourceNotFoundException
     */
    public function toggleActive(string $id, bool $active): Banner
    {
        $banner = $this->findOrFail($id);

        if ($banner->active === $active) {
            return $banner;
        }

        $banner->active = $active;
        $banner->save();

        BannerVisibilityChanged::dispatch($banner, $active);

        return $banner;
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function delete(string $id): void
    {
        $banner = $this->findOrFail($id);

        DB::transaction(function () use ($banner): void {
            $banner->delete();

            // Cerrar el hueco que deja el borrado evita que el orden se
            // degrade a números arbitrarios con el paso del tiempo.
            $this->compactPositions();
        });
    }

    /**
     * Reasigna las posiciones 0..n en el orden recibido.
     *
     * @param  list<string>  $orderedIds
     * @return Collection<int, Banner>
     */
    public function reorder(array $orderedIds): Collection
    {
        DB::transaction(static function () use ($orderedIds): void {
            foreach ($orderedIds as $position => $id) {
                Banner::query()->whereKey($id)->update(['sort_order' => $position]);
            }
        });

        return $this->list();
    }

    /**
     * Normaliza las posiciones existentes a una secuencia sin huecos.
     */
    private function compactPositions(): void
    {
        Banner::query()->ordered()->get()->each(static function (Banner $banner, int $index): void {
            if ($banner->sort_order !== $index) {
                $banner->sort_order = $index;
                $banner->save();
            }
        });
    }
}
