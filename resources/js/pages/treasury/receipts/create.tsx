import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotification } from '@/contexts/NotificationContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Client, ReceiptItem } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface Props {
  clients: Client[];
}

export default function CreateReceipt({ clients }: Props) {
  const { addNotification } = useNotification();
  const [items, setItems] = useState<ReceiptItem[]>([
    { descripcion: '', cantidad: 1, precio_unitario: '0', subtotal: '0' },
  ]);

  const { data, setData, post, processing, errors } = useForm({
    client_id: '',
    fecha_recibo: new Date().toISOString().split('T')[0],
    estado: 'pendiente' as 'pendiente' | 'pagado' | 'cancelado',
    metodo_pago: 'efectivo' as 'efectivo' | 'cheque' | 'transferencia' | 'tarjeta' | 'otro',
    referencia: '',
    concepto: '',
    observaciones: '',
    impuesto: '0',
    items: items,
  });

  const handleAddItem = () => {
    setItems([
      ...items,
      { descripcion: '', cantidad: 1, precio_unitario: '0', subtotal: '0' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setData('items', newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calcular subtotal
    if (field === 'cantidad' || field === 'precio_unitario') {
      const cantidad = field === 'cantidad' ? Number(value) : newItems[index].cantidad;
      const precio = field === 'precio_unitario' ? value : newItems[index].precio_unitario;
      newItems[index].subtotal = (cantidad * parseFloat(precio.toString())).toFixed(2);
    }

    setItems(newItems);
    setData('items', newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const impuesto = parseFloat(data.impuesto || '0');
    return subtotal + impuesto;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/treasury/receipts', {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Recibo creado correctamente ✓',
          duration: 3000,
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          message: 'Error al crear el recibo',
          duration: 5000,
        });
      },
    });
  };

   const breadcrumbs: BreadcrumbItem[] = [
              {
                  title: 'Recibos',
                  href: '/treasury/receipts',
              },
          ];
          
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Recibo" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/treasury/receipts">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Recibo</h1>
            <p className="text-muted-foreground mt-1">Crea un nuevo recibo de pago</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="client_id">Cliente *</Label>
                  <Select
                    value={data.client_id.toString()}
                    onValueChange={(value) => setData('client_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.nombre} {client.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client_id && (
                    <p className="text-sm text-red-500">{errors.client_id}</p>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_recibo">Fecha *</Label>
                  <Input
                    id="fecha_recibo"
                    type="date"
                    value={data.fecha_recibo}
                    onChange={(e) => setData('fecha_recibo', e.target.value)}
                  />
                  {errors.fecha_recibo && (
                    <p className="text-sm text-red-500">{errors.fecha_recibo}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select value={data.estado} onValueChange={(value: any) => setData('estado', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Método de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="metodo_pago">Método de Pago *</Label>
                  <Select value={data.metodo_pago} onValueChange={(value: any) => setData('metodo_pago', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Referencia */}
                <div className="space-y-2">
                  <Label htmlFor="referencia">Referencia</Label>
                  <Input
                    id="referencia"
                    value={data.referencia}
                    onChange={(e) => setData('referencia', e.target.value)}
                    placeholder="Ej: Cheque #123, Transferencia..."
                  />
                </div>

                {/* Concepto */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="concepto">Concepto</Label>
                  <Input
                    id="concepto"
                    value={data.concepto}
                    onChange={(e) => setData('concepto', e.target.value)}
                    placeholder="Concepto general del recibo"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conceptos</CardTitle>
                <Button type="button" onClick={handleAddItem} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Concepto
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start border-b pb-4">
                  <div className="flex-1 space-y-2">
                    <Label>Descripción *</Label>
                    <Input
                      value={item.descripcion}
                      onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                      placeholder="Descripción del concepto"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Precio Unit. *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.precio_unitario}
                      onChange={(e) => handleItemChange(index, 'precio_unitario', e.target.value)}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Subtotal</Label>
                    <Input value={item.subtotal} disabled />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-8"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Totales */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label>Subtotal:</Label>
                <p className="text-lg font-medium">
                  ${calculateSubtotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="impuesto">Impuesto:</Label>
                <Input
                  id="impuesto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.impuesto}
                  onChange={(e) => setData('impuesto', e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <Label className="text-xl">TOTAL:</Label>
                <p className="text-2xl font-bold">
                  ${calculateTotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={data.observaciones}
                onChange={(e) => setData('observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex gap-3 justify-end">
            <Link href="/treasury/receipts">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Crear Recibo'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
