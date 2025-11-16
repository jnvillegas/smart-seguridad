<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
             $table->id();
            $table->foreignId('bank_entity_id')->constrained('bank_entities')->onDelete('cascade');
            $table->string('numero_cuenta');
            $table->string('cbu')->unique();
            $table->string('alias')->nullable();
            $table->enum('tipo_cuenta', ['caja_ahorro', 'cuenta_corriente', 'cuenta_sueldo']);
            $table->enum('moneda', ['ARS', 'USD', 'EUR'])->default('ARS');
            $table->decimal('saldo_inicial', 15, 2)->default(0);
            $table->decimal('saldo_actual', 15, 2)->default(0);
            $table->date('fecha_apertura')->nullable();
            $table->boolean('activa')->default(true);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
