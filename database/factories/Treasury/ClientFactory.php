<?php

namespace Database\Factories\Treasury;

use App\Models\Treasury\Client;
use App\Enums\Treasury\TaxCategory;
use App\Enums\Treasury\DocumentType;
use App\Enums\Treasury\PersonType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->firstName(),
            'apellido' => $this->faker->lastName(),
            'documento' => $this->generateCuit(),
            'tipo_documento' => DocumentType::CUIT,
            'tipo_persona' => $this->faker->randomElement([PersonType::FISICA, PersonType::JURIDICA]),
            'nombre_fantasia' => $this->faker->boolean(30) ? $this->faker->company() : null,
            'categoria_fiscal' => $this->faker->randomElement(TaxCategory::cases()),
            'domicilio' => $this->faker->streetAddress(),
            'barrio' => $this->faker->citySuffix(),
            'localidad' => $this->faker->city(),
            'telefono' => $this->faker->phoneNumber(),
            'celular' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'contacto' => $this->faker->name(),
            'fecha_nacimiento' => $this->faker->dateTimeBetween('-70 years', '-18 years'),
            'estado_civil' => $this->faker->randomElement(['soltero', 'casado', 'viudo', 'divorciado']),
            'genero' => $this->faker->randomElement(['masculino', 'femenino', 'otro']),
            'es_cliente' => $this->faker->boolean(80),
            'es_proveedor' => $this->faker->boolean(30),
            'gran_contribuyente' => $this->faker->boolean(10),
        ];
    }

    private function generateCuit(): string
    {
        $tipo = rand(20, 27);
        $documento = str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        
        $cuitBase = $tipo . $documento;
        $multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        $suma = 0;
        
        for ($i = 0; $i < 10; $i++) {
            $suma += (int)$cuitBase[$i] * $multiplicadores[$i];
        }
        
        $resto = $suma % 11;
        $digito = $resto === 0 ? 0 : (11 - $resto);
        
        return $tipo . '-' . $documento . '-' . $digito;
    }
}
