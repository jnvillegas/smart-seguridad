<?php

namespace App\Http\Requests\Treasury;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:clients,id',
            'date' => 'required|date',
            'concept' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'is_advance' => 'boolean',
            'currency' => 'required|in:ARS,USD,EUR',
            'exchange_rate' => 'required|numeric|min:0',
            'exchange_rate_date' => 'nullable|date',
            'values' => 'nullable|array',
            'values.*.payment_type' => 'required|string',
            'values.*.amount' => 'required|numeric|min:0',
            'values.*.check_number' => 'nullable|string',
            'values.*.check_date' => 'nullable|date',
            'values.*.reference' => 'nullable|string',
            'withholdings' => 'nullable|array',
            'withholdings.*.tax_id' => 'required|exists:taxes,id',
            'withholdings.*.percentage' => 'required|numeric|min:0|max:100',
            'withholdings.*.amount' => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.required' => 'El proveedor es obligatorio',
            'supplier_id.exists' => 'El proveedor seleccionado no existe',
            'date.required' => 'La fecha es obligatoria',
            'concept.required' => 'El concepto es obligatorio',
            'currency.required' => 'La moneda es obligatoria',
        ];
    }
}
