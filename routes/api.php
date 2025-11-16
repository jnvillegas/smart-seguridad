<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Treasury\ClientController;
use App\Http\Controllers\Treasury\ClientTaxController;
use App\Http\Controllers\Treasury\ClientCertificateController;
use App\Http\Controllers\Treasury\CurrentAccountMovementController;

Route::middleware('auth:sanctum')->group(function () {
    // Clientes
    Route::apiResource('clients', ClientController::class);
    Route::post('clients/{client}/restore', [ClientController::class, 'restore']);
    Route::get('clients/{client}/balance', [ClientController::class, 'getBalance']);
    Route::get('clients/search', [ClientController::class, 'search']);

    // Impuestos de clientes
    Route::apiResource('clients.taxes', ClientTaxController::class)->shallow();

    // Certificados de clientes
    Route::apiResource('clients.certificates', ClientCertificateController::class)->shallow();

    // Movimientos de cuenta corriente
    Route::apiResource('clients.movements', CurrentAccountMovementController::class)->shallow();
});
