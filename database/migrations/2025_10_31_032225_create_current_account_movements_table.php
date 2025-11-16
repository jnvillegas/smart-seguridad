<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('current_account_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('concepto');
            $table->text('detalle')->nullable();
            $table->decimal('debe', 15, 2)->default(0);
            $table->decimal('haber', 15, 2)->default(0);
            $table->decimal('saldo', 15, 2);
            $table->string('documento_tipo')->nullable();
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->timestamps();
            
            $table->index(['client_id', 'fecha']);
            $table->index(['documento_tipo', 'documento_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('current_account_movements');
    }
};

