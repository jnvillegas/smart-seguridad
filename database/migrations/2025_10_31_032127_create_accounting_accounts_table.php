<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounting_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['activo', 'pasivo', 'patrimonio', 'ingreso', 'egreso'])->nullable();
            $table->boolean('imputable')->default(true);
            $table->boolean('activa')->default(true);
            $table->foreignId('parent_id')->nullable()->constrained('accounting_accounts')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounting_accounts');
    }
};
