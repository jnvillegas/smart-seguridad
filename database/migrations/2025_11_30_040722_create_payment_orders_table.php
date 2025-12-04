<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_orders', function (Blueprint $table) {
            $table->id();
            
            // Relaciones
            $table->foreignId('supplier_id')->nullable()->constrained('clients')->onDelete('restrict');
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            
            // IDs sin foreign keys (por ahora, hasta crear esas tablas)
            $table->unsignedBigInteger('branch_office_id')->nullable();
            $table->unsignedBigInteger('cash_register_id')->nullable();
            $table->unsignedBigInteger('cost_center_id')->nullable();
            
            // Datos principales
            $table->string('number', 50)->unique();
            $table->date('date');
            $table->string('concept');
            $table->text('detail')->nullable();
            
            // Estado y tipo
            $table->enum('status', ['en_proceso', 'cerrada', 'anulada'])->default('en_proceso');
            $table->boolean('is_advance')->default(false);
            
            // Moneda y cotización
            $table->string('currency', 3)->default('ARS');
            $table->decimal('exchange_rate', 15, 4)->default(1.0000);
            $table->date('exchange_rate_date')->nullable();
            
            // Totales
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('total_withholdings', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index('number');
            $table->index('date');
            $table->index('status');
            $table->index(['supplier_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_orders');
    }
};
