<?php

namespace App\Http\Controllers;

use App\Models\Treasury\Client;
use App\Models\Treasury\Receipt;
use App\Models\Treasury\BankEntity;
use App\Models\Treasury\BankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'clients' => [
                'total' => Client::count(),
                'active' => Client::where('es_cliente', true)->count(),
            ],
            'receipts' => [
                'total' => Receipt::count(),
                'pending' => Receipt::where('estado', 'pendiente')->count(),
                'paid' => Receipt::where('estado', 'pagado')->count(),
                'total_amount' => Receipt::where('estado', 'pagado')->sum('total') ?? 0,
            ],
            'banks' => [
                'entities' => BankEntity::where('activo', true)->count(),
                'accounts' => BankAccount::where('activa', true)->count(),
                'total_balance' => BankAccount::where('activa', true)->sum('saldo_actual') ?? 0,
            ],
        ];

        // ✅ Últimos 5 recibos - COLUMNA CORREGIDA
        $recentReceipts = Receipt::with('client')
            ->latest('fecha_recibo') // ✅ CAMBIO AQUÍ: fecha_recibo en vez de fecharecibo
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentReceipts' => $recentReceipts,
        ]);
    }
}


