<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Payload de alta/edición de un banner promocional.
 *
 * `order` no viaja aquí: la posición la administra BannerService (alta al final
 * de la lista, reordenamiento explícito vía endpoint dedicado).
 */
final readonly class BannerData
{
    public function __construct(
        public string $title,
        public string $subtitle,
        public ?string $imageUrl,
        public string $ctaLabel,
        public string $href,
        public string $accentFrom,
        public string $accentTo,
        public bool $active,
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
            title: trim((string) $data['title']),
            subtitle: trim((string) ($data['subtitle'] ?? '')),
            imageUrl: self::nullableString($data['image_url'] ?? null),
            ctaLabel: trim((string) ($data['cta_label'] ?? 'Ver más')),
            href: trim((string) ($data['href'] ?? '/')),
            accentFrom: (string) ($data['accent_from'] ?? '#005f8f'),
            accentTo: (string) ($data['accent_to'] ?? '#00aaff'),
            active: (bool) ($data['active'] ?? true),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image_url' => $this->imageUrl,
            'cta_label' => $this->ctaLabel,
            'href' => $this->href,
            'accent_from' => $this->accentFrom,
            'accent_to' => $this->accentTo,
            'active' => $this->active,
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
