<?php

namespace App\Enums\Treasury;

enum TaxCategory: string
{
    case SIN_INFORMAR = 'sin_informar';
    case RESPONSABLE_INSCRIPTO = 'responsable_inscripto';
    case NO_ALCANZADO = 'no_alcanzado';
    case MONOTRIBUTO = 'monotributo';
    case EXENTO = 'exento';
    case CONSUMIDOR_FINAL = 'consumidor_final';

    public function label(): string
    {
        return match($this) {
            self::SIN_INFORMAR => 'Sin Informar',
            self::RESPONSABLE_INSCRIPTO => 'Responsable Inscripto',
            self::NO_ALCANZADO => 'No Alcanzado',
            self::MONOTRIBUTO => 'Monotributo',
            self::EXENTO => 'Exento',
            self::CONSUMIDOR_FINAL => 'Consumidor Final',
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
