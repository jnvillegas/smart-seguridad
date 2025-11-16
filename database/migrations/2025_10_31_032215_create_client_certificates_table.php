<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->enum('tipo_certificado', ['IVA', 'IIBB']);
            $table->string('numero');
            $table->date('fecha_vencimiento');
            $table->boolean('alertado')->default(false);
            $table->timestamps();
            
            $table->index(['client_id', 'fecha_vencimiento']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_certificates');
    }
};
