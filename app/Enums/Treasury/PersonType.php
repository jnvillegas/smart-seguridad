<?php

namespace App\Enums\Treasury;

enum PersonType: string
{
    case FISICA = 'fisica';
    case JURIDICA = 'juridica';

    public function label(): string
    {
        return match($this) {
            self::FISICA => 'Persona Física',
            self::JURIDICA => 'Persona Jurídica',
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
