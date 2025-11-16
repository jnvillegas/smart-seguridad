<?php

namespace App\Http\Requests\Treasury;

use Illuminate\Foundation\Http\FormRequest;

class StoreCurrentAccountMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha' => ['required', 'date'],
            'concepto' => ['required', 'string', 'max:255'],
            'detalle' => ['nullable', 'string', 'max:1000'],
            'debe' => ['required', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'haber' => ['required', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'documento_tipo' => ['nullable', 'string', 'max:50'],
            'documento_id' => ['nullable', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'fecha.required' => 'La fecha es obligatoria',
            'concepto.required' => 'El concepto es obligatorio',
            'debe.required' => 'El monto de debe es obligatorio',
            'debe.numeric' => 'El debe debe ser un número',
            'debe.min' => 'El debe no puede ser negativo',
            'haber.required' => 'El monto de haber es obligatorio',
            'haber.numeric' => 'El haber debe ser un número',
            'haber.min' => 'El haber no puede ser negativo',
        ];
    }

    /**
     * Validación personalizada adicional
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Al menos uno de debe o haber debe ser mayor a 0
            if ($this->debe == 0 && $this->haber == 0) {
                $validator->errors()->add('movimiento', 'El debe o el haber debe ser mayor a 0');
            }
        });
    }
}
