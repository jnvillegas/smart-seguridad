<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCuitFormat implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Formato: XX-XXXXXXXX-X
        if (!preg_match('/^\d{2}-\d{8}-\d$/', $value)) {
            $fail('El formato del CUIT debe ser XX-XXXXXXXX-X');
            return;
        }

        // Validar dígito verificador
        $cuit = str_replace('-', '', $value);
        
        if (strlen($cuit) !== 11) {
            $fail('El CUIT debe tener 11 dígitos');
            return;
        }

        $multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        $suma = 0;

        for ($i = 0; $i < 10; $i++) {
            $suma += (int)$cuit[$i] * $multiplicadores[$i];
        }

        $resto = $suma % 11;
        $digitoVerificador = $resto === 0 ? 0 : (11 - $resto);

        if ($digitoVerificador !== (int)$cuit[10]) {
            $fail('El CUIT ingresado no es válido (dígito verificador incorrecto)');
        }
    }
}
