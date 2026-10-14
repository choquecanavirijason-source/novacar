<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Banners promocionales iniciales del home (mismos textos que el mock).
 */
class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::query()->where('email', 'admin@novacar.com')->first();

        $banners = [
            [
                'title' => 'Autopartes con envío gratis',
                'subtitle' => 'En baterías y llantas seleccionadas, todo el mes.',
                'image_url' => '/car-azul-hero.png',
                'cta_label' => 'Ver autopartes',
                'href' => '/autopartes',
                'accent_from' => '#005f8f',
                'accent_to' => '#00aaff',
                'active' => true,
                'sort_order' => 0,
            ],
            [
                'title' => 'Autos seminuevos certificados',
                'subtitle' => 'Revisión de 120 puntos y garantía incluida.',
                'image_url' => '/car-azul-hero.png',
                'cta_label' => 'Ver catálogo',
                'href' => '/catalogo',
                'accent_from' => '#0077b3',
                'accent_to' => '#4dc4ff',
                'active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::query()->updateOrCreate(
                ['title' => $banner['title']],
                [...$banner, 'created_by' => $author?->id],
            );
        }
    }
}
