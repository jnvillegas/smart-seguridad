<?php

namespace App\Enums\Treasury;

enum IIBBType: string
{
    case CONVENIO_MULTILATERAL = 'convenio_multilateral';
    case SUJETO_NO_CATEGORIZADO = 'sujeto_no_categorizado';
    case CONTRIBUYENTE_LOCAL = 'contribuyente_local';

    public function label(): string
    {
        return match($this) {
            self::CONVENIO_MULTILATERAL => 'Convenio Multilateral',
            self::SUJETO_NO_CATEGORIZADO => 'Sujeto No Categorizado',
            self::CONTRIBUYENTE_LOCAL => 'Contribuyente Local',
        };
    }

    public static function toArray(): array
    {
        return array_map(
            fn($case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
