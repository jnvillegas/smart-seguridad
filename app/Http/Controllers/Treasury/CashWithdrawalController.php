<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\CashWithdrawal;
use App\Services\Treasury\CashWithdrawalService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashWithdrawalController extends Controller
{
    protected CashWithdrawalService $service;

    public function __construct(CashWithdrawalService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'per_page' => $request->input('per_page', 15),
        ];

        $withdrawals = $this->service->getAllWithFilters($filters);

        return Inertia::render('treasury/cash-withdrawals/index', [
            'withdrawals' => $withdrawals,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $cashRegisters = \App\Models\Treasury\CashRegister::orderBy('name')->get(['id', 'name']);
        $costCenters = \App\Models\Treasury\CostCenter::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('treasury/cash-withdrawals/create', [
            'cashRegisters' => $cashRegisters,
            'costCenters' => $costCenters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'reason' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'cash_register_id' => 'nullable|integer',
            'cost_center_id' => 'nullable|integer',
            'currency' => 'required|string|size:3',
            'items' => 'nullable|array',
            'items.*.concept' => 'required|string|max:255',
            'items.*.observation' => 'nullable|string',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        try {
            $withdrawal = $this->service->create($validated);

            return redirect()
                ->route('treasury.cash-withdrawals.show', $withdrawal)
                ->with('success', 'Egreso de caja creado correctamente');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(CashWithdrawal $cashWithdrawal)
    {
        $cashWithdrawal->load(['items', 'user', 'cashRegister', 'costCenter']);

        return Inertia::render('treasury/cash-withdrawals/show', [
            'withdrawal' => $cashWithdrawal,
        ]);
    }

    public function edit(CashWithdrawal $cashWithdrawal)
    {
        $cashRegisters = \App\Models\Treasury\CashRegister::orderBy('name')->get(['id', 'name']);
        $costCenters = \App\Models\Treasury\CostCenter::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('treasury/cash-withdrawals/edit', [
            'withdrawal' => $cashWithdrawal->load('items'),
            'cashRegisters' => $cashRegisters,
            'costCenters' => $costCenters,
        ]);
    }

    public function update(Request $request, CashWithdrawal $cashWithdrawal)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'recipient' => 'required|string|max:255',
            'reason' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'cash_register_id' => 'nullable|integer',
            'cost_center_id' => 'nullable|integer',
            'currency' => 'required|string|size:3',
            'items' => 'nullable|array',
            'items.*.concept' => 'required|string|max:255',
            'items.*.observation' => 'nullable|string',
            'items.*.amount' => 'required|numeric|min:0',
        ]);

        try {
            $updated = $this->service->update($cashWithdrawal, $validated);

            return redirect()
                ->route('treasury.cash-withdrawals.show', $updated)
                ->with('success', 'Egreso de caja actualizado correctamente');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function changeStatus(Request $request, CashWithdrawal $cashWithdrawal)
    {
        $validated = $request->validate([
            'status' => 'required|in:en_proceso,cerrado,anulado',
        ]);

        try {
            $this->service->changeStatus($cashWithdrawal, $validated['status']);

            return back()->with('success', 'Estado actualizado correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(CashWithdrawal $cashWithdrawal)
    {
        try {
            $this->service->delete($cashWithdrawal);

            return redirect()
                ->route('treasury.cash-withdrawals.index')
                ->with('success', 'Egreso de caja eliminado correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
