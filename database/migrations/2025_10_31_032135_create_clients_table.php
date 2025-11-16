<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            
            // Identificación
            $table->string('nombre');
            $table->string('apellido');
            $table->string('documento')->unique();
            $table->enum('tipo_documento', ['DNI', 'CUIT', 'CUIL', 'PASAPORTE']);
            $table->enum('tipo_persona', ['fisica', 'juridica']);
            $table->string('nombre_fantasia')->nullable();
            $table->string('codigo_interno')->unique()->nullable();
            
            // Flags
            $table->boolean('es_cliente')->default(true);
            $table->boolean('es_proveedor')->default(false);
            
            // Datos Fiscales
            $table->enum('categoria_fiscal', [
                'sin_informar',
                'responsable_inscripto',
                'no_alcanzado',
                'monotributo',
                'exento',
                'consumidor_final'
            ]);
            $table->enum('persona_tipo_iibb', [
                'convenio_multilateral',
                'sujeto_no_categorizado',
                'contribuyente_local'
            ])->nullable();
            $table->string('nro_ingresos_brutos')->nullable();
            $table->boolean('gran_contribuyente')->default(false);
            
            // Domicilio
            $table->string('domicilio');
            $table->string('barrio')->nullable();
            $table->string('localidad');
            
            // Contacto
            $table->string('telefono')->nullable();
            $table->string('celular')->nullable();
            $table->string('email')->nullable();
            $table->string('contacto')->nullable();
            
            // Datos Adicionales
            $table->date('fecha_nacimiento')->nullable();
            $table->integer('edad')->nullable();
            $table->string('estado_civil')->nullable();
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->nullable();
            
            // Contabilidad
            $table->foreignId('cuenta_contable_id')->nullable()
                  ->constrained('accounting_accounts')->nullOnDelete();
            $table->text('observaciones')->nullable();
            
            // Saldo
            $table->decimal('saldo', 15, 2)->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index('documento');
            $table->index('codigo_interno');
            $table->index(['es_cliente', 'es_proveedor']);
            $table->index('categoria_fiscal');
            $table->index('localidad');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
