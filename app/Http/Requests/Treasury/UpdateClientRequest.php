<?php

namespace App\Http\Requests\Treasury;

use App\Enums\Treasury\TaxCategory;
use App\Enums\Treasury\DocumentType;
use App\Enums\Treasury\PersonType;
use App\Enums\Treasury\IIBBType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $clientId = $this->route('client')->id;

        return [
            // Información Personal
            'nombre' => ['required', 'string', 'max:100'],
            'apellido' => ['required', 'string', 'max:100'],
            'documento' => ['required', 'string', 'max:20', "unique:clients,documento,{$clientId}"],
            'tipo_documento' => ['required', new Enum(DocumentType::class)],
            'tipo_persona' => ['required', new Enum(PersonType::class)],

            // Información Opcional
            'nombre_fantasia' => ['nullable', 'string', 'max:100'],
            'codigo_interno' => ['nullable', 'string', "unique:clients,codigo_interno,{$clientId}"],

            // Flags
            'es_cliente' => ['boolean'],
            'es_proveedor' => ['boolean'],

            // Datos Fiscales
            'categoria_fiscal' => ['required', new Enum(TaxCategory::class)],
            'persona_tipo_iibb' => ['nullable', new Enum(IIBBType::class)],
            'nro_ingresos_brutos' => ['nullable', 'string', 'max:50'],
            'gran_contribuyente' => ['boolean'],

            // Domicilio
            'domicilio' => ['required', 'string', 'max:200'],
            'barrio' => ['nullable', 'string', 'max:100'],
            'localidad' => ['required', 'string', 'max:100'],

            // Contacto
            'telefono' => ['nullable', 'string', 'max:20'],
            'celular' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:100', "unique:clients,email,{$clientId}"],
            'contacto' => ['nullable', 'string', 'max:100'],

            // Datos Adicionales
            'fecha_nacimiento' => ['nullable', 'date', 'before:today'],
            'estado_civil' => ['nullable', 'string', 'max:50'],
            'genero' => ['nullable', 'in:masculino,femenino,otro'],

            // Contabilidad
            'cuenta_contable_id' => ['nullable', 'exists:accounting_accounts,id'],
            'observaciones' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'apellido.required' => 'El apellido es obligatorio',
            'documento.required' => 'El documento es obligatorio',
            'documento.unique' => 'Este documento ya existe en el sistema',
            'tipo_documento.required' => 'Debes seleccionar un tipo de documento',
            'tipo_persona.required' => 'Debes seleccionar un tipo de persona',
            'categoria_fiscal.required' => 'Debes seleccionar una categoría fiscal',
            'domicilio.required' => 'El domicilio es obligatorio',
            'localidad.required' => 'La localidad es obligatoria',
            'email.email' => 'El email debe ser un email válido',
            'email.unique' => 'Este email ya está registrado',
            'fecha_nacimiento.before' => 'La fecha de nacimiento debe ser anterior a hoy',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'es_cliente' => $this->boolean('es_cliente'),
            'es_proveedor' => $this->boolean('es_proveedor'),
            'gran_contribuyente' => $this->boolean('gran_contribuyente'),
        ]);
    }
}

