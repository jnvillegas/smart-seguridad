<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_order_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_order_id')->constrained()->onDelete('cascade');
            
            // Tipo de pago
            $table->enum('payment_type', [
                'efectivo',
                'cheque_propio',
                'cheque_terceros',
                'transferencia',
                'tarjeta',
                'nota_credito',
                'nota_credito_interna',
                'compensacion'
            ]);
            
            // Datos del valor
            $table->decimal('amount', 15, 2); // Monto pagado
            $table->string('currency', 3)->default('ARS');
            $table->decimal('exchange_rate', 15, 4)->default(1.0000);
            
            // Datos específicos según tipo
            $table->string('check_number', 50)->nullable(); // Número de cheque
            $table->date('check_date')->nullable(); // Fecha de cobro del cheque
            $table->foreignId('bank_entity_id')->nullable()->constrained()->onDelete('restrict'); // Entidad financiera
            $table->foreignId('bank_account_id')->nullable()->constrained()->onDelete('restrict'); // Cuenta bancaria propia
            
            $table->string('reference')->nullable(); // Referencia/Observaciones
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_order_values');
    }
};
