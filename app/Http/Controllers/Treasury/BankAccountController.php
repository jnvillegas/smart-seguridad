<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\BankAccount;
use App\Services\Treasury\BankAccountService;
use App\Services\Treasury\BankEntityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankAccountController extends Controller
{
    protected $service;
    protected $bankEntityService;

    public function __construct(BankAccountService $service, BankEntityService $bankEntityService)
    {
        $this->service = $service;
        $this->bankEntityService = $bankEntityService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'tipo_cuenta', 'moneda', 'activa', 'bank_entity_id']);
        $accounts = $this->service->getAllPaginated($filters);
        $bankEntities = $this->bankEntityService->getAll();

        return Inertia::render('treasury/bank-accounts/index', [
            'accounts' => $accounts,
            'bankEntities' => $bankEntities,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $bankEntities = $this->bankEntityService->getAll();

        return Inertia::render('treasury/bank-accounts/create', [
            'bankEntities' => $bankEntities,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_entity_id' => 'required|exists:bank_entities,id',
            'numero_cuenta' => 'required|string|max:255',
            'cbu' => 'required|string|size:22|unique:bank_accounts,cbu',
            'alias' => 'nullable|string|max:255',
            'tipo_cuenta' => 'required|in:caja_ahorro,cuenta_corriente,cuenta_sueldo',
            'moneda' => 'required|in:ARS,USD,EUR',
            'saldo_inicial' => 'required|numeric|min:0',
            'fecha_apertura' => 'nullable|date',
            'activa' => 'boolean',
            'observaciones' => 'nullable|string',
        ]);

        $validated['saldo_actual'] = $validated['saldo_inicial'];

        try {
            $this->service->create($validated);
            return redirect()->route('treasury.bank-accounts.index')
                ->with('success', 'Cuenta bancaria creada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function show(BankAccount $bankAccount)
    {
        $account = $this->service->findById($bankAccount->id);

        return Inertia::render('treasury/bank-accounts/show', [
            'account' => $account,
        ]);
    }

    public function edit(BankAccount $bankAccount)
    {
        $bankEntities = $this->bankEntityService->getAll();

        return Inertia::render('treasury/bank-accounts/edit', [
            'account' => $bankAccount->load('bankEntity'),
            'bankEntities' => $bankEntities,
        ]);
    }

    public function update(Request $request, BankAccount $bankAccount)
    {
        $validated = $request->validate([
            'bank_entity_id' => 'required|exists:bank_entities,id',
            'numero_cuenta' => 'required|string|max:255',
            'cbu' => 'required|string|size:22|unique:bank_accounts,cbu,' . $bankAccount->id,
            'alias' => 'nullable|string|max:255',
            'tipo_cuenta' => 'required|in:caja_ahorro,cuenta_corriente,cuenta_sueldo',
            'moneda' => 'required|in:ARS,USD,EUR',
            'saldo_inicial' => 'required|numeric|min:0',
            'fecha_apertura' => 'nullable|date',
            'activa' => 'boolean',
            'observaciones' => 'nullable|string',
        ]);

        try {
            $this->service->update($bankAccount, $validated);
            return redirect()->route('treasury.bank-accounts.show', $bankAccount)
                ->with('success', 'Cuenta bancaria actualizada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy(BankAccount $bankAccount)
    {
        try {
            $this->service->delete($bankAccount);
            return redirect()->route('treasury.bank-accounts.index')
                ->with('success', 'Cuenta bancaria eliminada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}

