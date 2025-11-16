<?php

namespace App\Http\Requests\Treasury;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_certificado' => ['required', 'in:IVA,IIBB'],
            'numero' => ['required', 'string', 'max:100'],
            'fecha_vencimiento' => ['required', 'date', 'after:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_certificado.required' => 'Debes seleccionar un tipo de certificado',
            'tipo_certificado.in' => 'El tipo de certificado debe ser IVA o IIBB',
            'numero.required' => 'El número de certificado es obligatorio',
            'fecha_vencimiento.required' => 'La fecha de vencimiento es obligatoria',
            'fecha_vencimiento.after' => 'La fecha de vencimiento debe ser posterior a hoy',
        ];
    }
}
