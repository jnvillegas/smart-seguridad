<?php

namespace App\Http\Requests\Treasury;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientTaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tax_id' => ['required', 'exists:taxes,id'],
            'fecha_actualizacion' => ['required', 'date'],
            'alcuota' => ['required', 'numeric', 'min:0', 'max:100'],
            'observaciones' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'tax_id.required' => 'Debes seleccionar un impuesto',
            'tax_id.exists' => 'El impuesto seleccionado no existe',
            'fecha_actualizacion.required' => 'La fecha de actualización es obligatoria',
            'alcuota.required' => 'La alícuota es obligatoria',
            'alcuota.min' => 'La alícuota debe ser mayor o igual a 0',
            'alcuota.max' => 'La alícuota no puede ser mayor a 100',
        ];
    }
}

