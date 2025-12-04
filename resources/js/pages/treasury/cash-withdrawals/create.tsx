import { Head, router, useForm } from '@inertiajs/react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { CashWithdrawalItem, CashRegister, CostCenter } from '@/types/treasury';


interface Props {
  cashRegisters: CashRegister[];
  costCenters: CostCenter[];
}

interface FormData {
  date: string;
  recipient: string;
  reason: string;
  detail: string;
  cash_register_id: number | '';
  cost_center_id: number | '';
  currency: string;
  items: CashWithdrawalItem[];
}

export default function CreateCashWithdrawal({ cashRegisters, costCenters }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const { data, setData, post, processing, errors } = useForm<FormData>({
    date: today,
    recipient: '',
    reason: '',
    detail: '',
    cash_register_id: '',
    cost_center_id: '',
    currency: 'ARS',
    items: [],
  });

  const [newItem, setNewItem] = useState<CashWithdrawalItem>({
    concept: '',
    observation: '',
    amount: 0,
  });

  const total = data.items.reduce((sum, i) => sum + Number(i.amount), 0);

  const addItem = () => {
    if (!newItem.concept || newItem.amount <= 0) {
      toast.error('Concepto y monto son obligatorios');
      return;
    }

    setData('items', [...data.items, { ...newItem }]);
    setNewItem({ concept: '', observation: '', amount: 0 });
  };

  const removeItem = (index: number) => {
    setData('items', data.items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.recipient || !data.reason) {
      toast.error('Destinatario y motivo son obligatorios');
      return;
    }

    if (data.items.length === 0) {
      toast.error('Debe cargar al menos un concepto con monto');
      return;
    }

    post('/treasury/cash-withdrawals', {
      onSuccess: () => toast.success('Egreso de caja creado correctamente'),
      onError: () => toast.error('Error al crear el egreso de caja'),
    });
  };

  return (
    <AppLayout>
      <Head title="Nuevo Egreso de Caja" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nuevo Egreso de Caja</h1>
            <p className="text-muted-foreground">
              Registrar una salida de fondos de la caja tesorería
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/treasury/cash-withdrawals')}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos principales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                  />
                  {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Caja Sucursal</Label>
                  <Select
                    value={data.cash_register_id ? data.cash_register_id.toString() : ''}
                    onValueChange={(value) => setData('cash_register_id', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una caja" />
                    </SelectTrigger>
                    <SelectContent>
                      {cashRegisters.map((cr) => (
                        <SelectItem key={cr.id} value={cr.id.toString()}>
                          {cr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Destinatario</Label>
                  <Input
                    value={data.recipient}
                    onChange={(e) => setData('recipient', e.target.value)}
                    placeholder="Ej: ANTICIPOS DE SUELDO"
                  />
                  {errors.recipient && (
                    <p className="text-sm text-destructive">{errors.recipient}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Motivo</Label>
                  <Input
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                    placeholder="Motivo del egreso"
                  />
                  {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Centro de Costos</Label>
                  <Select
                    value={data.cost_center_id ? data.cost_center_id.toString() : ''}
                    onValueChange={(value) => setData('cost_center_id', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un centro de costos" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenters.map((cc) => (
                        <SelectItem key={cc.id} value={cc.id.toString()}>
                          {cc.code} - {cc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select
                    value={data.currency}
                    onValueChange={(value) => setData('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
                      <SelectItem value="EUR">Euros (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Detalle</Label>
                <Textarea
                  value={data.detail}
                  onChange={(e) => setData('detail', e.target.value)}
                  placeholder="Ej: ANTICIPOS DE SUELDO SEPTIEMBRE 2025"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conceptos adicionales */}
          <Card>
            <CardHeader>
              <CardTitle>Conceptos Adicionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Concepto</Label>
                  <Input
                    value={newItem.concept}
                    onChange={(e) => setNewItem({ ...newItem, concept: e.target.value })}
                    placeholder="Concepto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.amount}
                    onChange={(e) =>
                      setNewItem({ ...newItem, amount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Observación</Label>
                  <Input
                    value={newItem.observation || ''}
                    onChange={(e) =>
                      setNewItem({ ...newItem, observation: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" size="sm" className="gap-2" onClick={addItem}>
                  <PlusCircle className="w-4 h-4" />
                  Agregar Concepto
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Observación</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No hay conceptos cargados
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.observation}</TableCell>
                          <TableCell>{item.concept}</TableCell>
                          <TableCell className="text-right">
                            ${Number(item.amount).toLocaleString('es-AR', {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end text-lg font-bold">
                Total:{' '}
                {total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/treasury/cash-withdrawals')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Egreso'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
