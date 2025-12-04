<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_order_withholdings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('tax_id')->constrained()->onDelete('restrict'); // Impuesto (RETENCIÓN TEM, IVA, etc)
            
            $table->decimal('percentage', 5, 2)->default(0); // Porcentaje
            $table->decimal('amount', 15, 2); // Monto
            $table->decimal('aliquot', 5, 2)->default(0); // Alícuota
            
            $table->string('payment_commitment', 50)->nullable(); // Compromiso Pago
            $table->string('certificate_number', 50)->nullable(); // Certificado
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_order_withholdings');
    }
};
