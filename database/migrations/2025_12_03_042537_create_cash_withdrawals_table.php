<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cash_withdrawals', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->date('date');
            $table->string('recipient'); // Destinatario
            $table->string('reason'); // Motivo
            $table->text('detail')->nullable();
            $table->unsignedBigInteger('cash_register_id')->nullable();
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->string('currency', 3)->default('ARS');
            $table->decimal('total', 15, 2)->default(0);
            $table->enum('status', ['en_proceso', 'cerrado', 'anulado'])->default('en_proceso');
            $table->text('observations')->nullable();
            $table->timestamps();
        });

        // Tabla de conceptos adicionales
        Schema::create('cash_withdrawal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cash_withdrawal_id')->constrained('cash_withdrawals')->onDelete('cascade');
            $table->string('concept');
            $table->text('observation')->nullable();
            $table->decimal('amount', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_withdrawal_items');
        Schema::dropIfExists('cash_withdrawals');
    }
};
