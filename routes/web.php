<?php

use App\Http\Controllers\RoleController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Treasury\ClientController;
use App\Http\Controllers\Treasury\ClientTaxController;
use App\Http\Controllers\Treasury\ClientCertificateController;
use App\Http\Controllers\Treasury\ClientAttachmentController;
use App\Http\Controllers\Treasury\ReceiptController;
use App\Http\Controllers\Treasury\BankEntityController;
use App\Http\Controllers\Treasury\BankAccountController;
use App\Http\Controllers\Treasury\PaymentOrderController;
use App\Http\Controllers\Treasury\CashWithdrawalController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ========================================
    // MÓDULO TREASURY (TESORERÍA)
    // ========================================
    Route::prefix('treasury')->name('treasury.')->group(function () {

        // -------------------- CLIENTES --------------------
        Route::resource('clients', ClientController::class);

        // Exportaciones de Clientes
        Route::get('clients-export/excel', [ClientController::class, 'exportExcel'])
            ->name('clients.export.excel');
        Route::get('clients/{client}/export/pdf', [ClientController::class, 'exportPdf'])
            ->name('clients.export.pdf');

        // Impuestos de Cliente
        Route::post('clients/{client}/taxes', [ClientTaxController::class, 'store'])
            ->name('clients.taxes.store');
        Route::put('clients/{client}/taxes/{tax}', [ClientTaxController::class, 'update'])
            ->name('clients.taxes.update');
        Route::delete('clients/{client}/taxes/{tax}', [ClientTaxController::class, 'destroy'])
            ->name('clients.taxes.destroy');

        // Certificados de Cliente
        Route::post('clients/{client}/certificates', [ClientCertificateController::class, 'store'])
            ->name('clients.certificates.store');
        Route::put('clients/{client}/certificates/{certificate}', [ClientCertificateController::class, 'update'])
            ->name('clients.certificates.update');
        Route::delete('clients/{client}/certificates/{certificate}', [ClientCertificateController::class, 'destroy'])
            ->name('clients.certificates.destroy');

        // Archivos Adjuntos de Cliente
        Route::post('clients/{client}/attachments', [ClientAttachmentController::class, 'store'])
            ->name('clients.attachments.store');
        Route::get('clients/{client}/attachments/{attachment}/download', [ClientAttachmentController::class, 'download'])
            ->name('clients.attachments.download');
        Route::delete('clients/{client}/attachments/{attachment}', [ClientAttachmentController::class, 'destroy'])
            ->name('clients.attachments.destroy');

        // -------------------- RECIBOS --------------------
        Route::resource('receipts', ReceiptController::class);
        Route::get('receipts/{receipt}/download-pdf', [ReceiptController::class, 'downloadPdf'])
            ->name('receipts.download-pdf');

        // -------------------- ÓRDENES DE PAGO --------------------
        Route::resource('payment-orders', PaymentOrderController::class)->names([
            'index' => 'payment-orders.index',
            'create' => 'payment-orders.create',
            'store' => 'payment-orders.store',
            'show' => 'payment-orders.show',
            'edit' => 'payment-orders.edit',
            'update' => 'payment-orders.update',
            'destroy' => 'payment-orders.destroy',
        ]);

                // -------------------- EGRESOS DE CAJA --------------------
        Route::resource('cash-withdrawals', CashWithdrawalController::class)->names([
            'index' => 'cash-withdrawals.index',
            'create' => 'cash-withdrawals.create',
            'store' => 'cash-withdrawals.store',
            'show' => 'cash-withdrawals.show',
            'edit' => 'cash-withdrawals.edit',
            'update' => 'cash-withdrawals.update',
            'destroy' => 'cash-withdrawals.destroy',
        ]);

        // Cambiar estado de egreso de caja
        Route::post('cash-withdrawals/{cashWithdrawal}/change-status', [CashWithdrawalController::class, 'changeStatus'])
            ->name('cash-withdrawals.change-status');

        
        // Cambiar estado de orden de pago
        Route::post('payment-orders/{paymentOrder}/change-status', [PaymentOrderController::class, 'changeStatus'])
            ->name('payment-orders.change-status');

        // -------------------- BANCOS --------------------
        // Entidades Bancarias
        Route::resource('bank-entities', BankEntityController::class)->names('bank-entities');

        // Cuentas Bancarias
        Route::resource('bank-accounts', BankAccountController::class)->names('bank-accounts');
    });

    // ========================================
    // ADMINISTRACIÓN DE USUARIOS Y ROLES
    // ========================================
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
});

// ========================================
// RUTAS CON PERMISOS ESPECÍFICOS
// ========================================
Route::delete('/users/{user}', [UserController::class, 'destroy'])
    ->middleware('permission:delete-users');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
