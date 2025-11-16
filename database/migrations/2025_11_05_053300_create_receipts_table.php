<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            
            // Relación con cliente
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            
            // Datos del recibo
            $table->string('numero_recibo')->unique(); // REC-000001
            $table->date('fecha_recibo');
            $table->enum('estado', ['pendiente', 'pagado', 'cancelado'])->default('pendiente');
            
            // Montos
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('impuesto', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            
            // Referencia
            $table->string('referencia')->nullable(); // Cheque, transferencia, etc.
            $table->text('concepto')->nullable(); // Descripción general
            $table->text('observaciones')->nullable();
            
            // Método de pago
            $table->enum('metodo_pago', ['efectivo', 'cheque', 'transferencia', 'tarjeta', 'otro'])->default('efectivo');
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id')->constrained('receipts')->onDelete('cascade');
            
            $table->string('descripcion'); // Concepto/Descripción
            $table->integer('cantidad')->default(1);
            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('subtotal', 12, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipt_items');
        Schema::dropIfExists('receipts');
    }
};

