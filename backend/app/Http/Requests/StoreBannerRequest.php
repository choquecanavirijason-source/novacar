<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\ImageReference;

/**
 * Alta de banner promocional (`POST /api/admin/banners`).
 */
class StoreBannerRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'subtitle' => ['nullable', 'string', 'max:200'],
            'image_url' => ['nullable', new ImageReference],
            'cta_label' => ['required', 'string', 'max:40'],
            // Ruta interna del sitio o URL absoluta hacia una campaña externa.
            'href' => ['required', 'string', 'max:2048', 'regex:#^(/|https?://)#'],
            'accent_from' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_to' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'active' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'href.regex' => 'El destino debe ser una ruta del sitio (/catalogo) o una URL http(s).',
            'accent_from.regex' => 'El color de acento inicial debe ser hexadecimal.',
            'accent_to.regex' => 'El color de acento final debe ser hexadecimal.',
            'title.max' => 'El título no puede superar los 120 caracteres.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'título',
            'subtitle' => 'subtítulo',
            'image_url' => 'imagen',
            'cta_label' => 'texto del botón',
            'href' => 'destino',
            'accent_from' => 'color de acento inicial',
            'accent_to' => 'color de acento final',
            'active' => 'estado',
        ];
    }
}
