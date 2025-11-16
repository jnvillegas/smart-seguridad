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
use App\Http\Controllers\DashboardController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

   Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');


    // Rutas de Treasury - Clientes
    Route::prefix('treasury')->name('treasury.')->group(function () {

        // CRUD de Clientes
        Route::resource('clients', ClientController::class);


        // Recibos
        Route::resource('receipts', ReceiptController::class);
        Route::get('receipts/{receipt}/download-pdf', [ReceiptController::class, 'downloadPdf'])
            ->name('receipts.download-pdf');

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

        // Entidades Bancarias
        Route::resource('bank-entities', BankEntityController::class)->names('bank-entities');

        // Cuentas Bancarias
        Route::resource('bank-accounts', BankAccountController::class)->names('bank-accounts');


    });

    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);

});

// Solo usuarios con el permiso 'delete-users' pueden acceder.
Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('permission:delete-users');



// O puedes proteger un grupo de rutas:
/*Route::middleware('permission:edit-posts')->group(function () {
    Route::get('/posts/{post}/edit', [PostController::class, 'edit']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
});*/




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';