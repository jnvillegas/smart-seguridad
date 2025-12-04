<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\PaymentOrder;
use App\Services\Treasury\PaymentOrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Treasury\StorePaymentOrderRequest;
use App\Http\Requests\Treasury\UpdatePaymentOrderRequest;

class PaymentOrderController extends Controller
{
    protected PaymentOrderService $service;

    public function __construct(PaymentOrderService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of payment orders
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'per_page' => $request->input('per_page', 15),
        ];

        $paymentOrders = $this->service->getAllWithFilters($filters);

        return Inertia::render('treasury/payment-orders/index', [
            'paymentOrders' => $paymentOrders,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new payment order
     */
    public function create()
    {
        $suppliers = \App\Models\Treasury\Client::where('es_proveedor', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'apellido', 'documento']);
        
        $taxes = \App\Models\Tax::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo', 'porcentaje_default']);

        return Inertia::render('treasury/payment-orders/create', [
            'suppliers' => $suppliers,
            'taxes' => $taxes,
        ]);
    }

    /**
     * Store a newly created payment order
     * ✅ CAMBIADO: Usa StorePaymentOrderRequest
     */
    public function store(StorePaymentOrderRequest $request)
    {
        try {
            $paymentOrder = $this->service->create($request->validated());

            return redirect()
                ->route('treasury.payment-orders.show', $paymentOrder)
                ->with('success', 'Orden de pago creada exitosamente');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified payment order
     */
    public function show(PaymentOrder $paymentOrder)
    {
        $paymentOrder->load(['supplier', 'user', 'values.bankEntity', 'values.bankAccount', 'withholdings.tax']);

        return Inertia::render('treasury/payment-orders/show', [
            'paymentOrder' => $paymentOrder,
        ]);
    }

    /**
     * Show the form for editing the specified payment order
     */
    public function edit(PaymentOrder $paymentOrder)
    {
        $suppliers = \App\Models\Treasury\Client::where('es_proveedor', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'apellido', 'documento']);
        
        $taxes = \App\Models\Tax::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo', 'porcentaje_default']);

        return Inertia::render('treasury/payment-orders/edit', [
            'paymentOrder' => $paymentOrder->load(['supplier', 'values', 'withholdings.tax']),
            'suppliers' => $suppliers,
            'taxes' => $taxes,
        ]);
    }

    /**
     * Update the specified payment order
     * ✅ CAMBIADO: Usa UpdatePaymentOrderRequest
     */
    public function update(UpdatePaymentOrderRequest $request, PaymentOrder $paymentOrder)
    {
        try {
            $updatedOrder = $this->service->update($paymentOrder, $request->validated());

            return redirect()
                ->route('treasury.payment-orders.show', $updatedOrder)
                ->with('success', 'Orden de pago actualizada exitosamente');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Change status of payment order
     */
    public function changeStatus(Request $request, PaymentOrder $paymentOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:en_proceso,cerrada,anulada',
        ]);

        try {
            $updatedOrder = $this->service->changeStatus($paymentOrder, $validated['status']);

            return back()->with('success', 'Estado actualizado exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified payment order
     */
    public function destroy(PaymentOrder $paymentOrder)
    {
        try {
            $this->service->delete($paymentOrder);

            return redirect()
                ->route('treasury.payment-orders.index')
                ->with('success', 'Orden de pago eliminada exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
