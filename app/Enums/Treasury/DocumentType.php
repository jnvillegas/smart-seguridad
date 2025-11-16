<?php

namespace App\Enums\Treasury;

enum DocumentType: string
{
    case DNI = 'DNI';
    case CUIT = 'CUIT';
    case CUIL = 'CUIL';
    case PASAPORTE = 'PASAPORTE';

    public function label(): string
    {
        return $this->value;
    }

    public static function toArray(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
