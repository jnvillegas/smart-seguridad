<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\BankEntity;
use App\Services\Treasury\BankEntityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankEntityController extends Controller
{
    protected $service;

    public function __construct(BankEntityService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'activo']);
        $entities = $this->service->getAllPaginated($filters);

        return Inertia::render('treasury/bank-entities/index', [
            'entities' => $entities,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('treasury/bank-entities/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_bcra' => 'nullable|string|unique:bank_entities,codigo_bcra',
            'cuit' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'web' => 'nullable|url|max:255',
            'direccion' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        try {
            $this->service->create($validated);
            return redirect()->route('treasury.bank-entities.index')
                ->with('success', 'Entidad bancaria creada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function show(BankEntity $bankEntity)
    {
        $entity = $this->service->findById($bankEntity->id);

        return Inertia::render('treasury/bank-entities/show', [
            'entity' => $entity,
        ]);
    }

    public function edit(BankEntity $bankEntity)
    {
        return Inertia::render('treasury/bank-entities/edit', [
            'entity' => $bankEntity,
        ]);
    }

    public function update(Request $request, BankEntity $bankEntity)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_bcra' => 'nullable|string|unique:bank_entities,codigo_bcra,' . $bankEntity->id,
            'cuit' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'web' => 'nullable|url|max:255',
            'direccion' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        try {
            $this->service->update($bankEntity, $validated);
            return redirect()->route('treasury.bank-entities.show', $bankEntity)
                ->with('success', 'Entidad bancaria actualizada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function destroy(BankEntity $bankEntity)
    {
        try {
            $this->service->delete($bankEntity);
            return redirect()->route('treasury.bank-entities.index')
                ->with('success', 'Entidad bancaria eliminada correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
