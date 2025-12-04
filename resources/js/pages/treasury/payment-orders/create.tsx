import { Head, useForm, router } from '@inertiajs/react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2, Save, X } from 'lucide-react';
import { PaymentOrderFormData, PaymentOrderValue, PaymentOrderWithholding } from '@/types/treasury';
import { useState } from 'react';
import { toast } from 'sonner';

// ✅ AGREGADO: Interface Props
interface Props {
  suppliers: Array<{
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
  }>;
  taxes: Array<{
    id: number;
    nombre: string;
    codigo: string;
    porcentaje_default: number;
  }>;
}

// ✅ CAMBIADO: Recibir props
export default function Create({ suppliers, taxes }: Props) {
  const { data, setData, post, processing, errors } = useForm<PaymentOrderFormData>({
    supplier_id: 0,
    date: new Date().toISOString().split('T')[0],
    concept: '',
    detail: '',
    is_advance: false,
    currency: 'ARS',
    exchange_rate: 1.0,
    exchange_rate_date: '',
    values: [],
    withholdings: [],
  });

  const [showValueModal, setShowValueModal] = useState(false);
  const [showWithholdingModal, setShowWithholdingModal] = useState(false);

  // ==================== VALORES ====================
  const [newValue, setNewValue] = useState<PaymentOrderValue>({
    payment_type: 'efectivo',
    amount: 0,
    currency: 'ARS',
    exchange_rate: 1.0,
  });

  const addValue = () => {
    if (newValue.amount <= 0) {
      toast.error('El monto debe ser mayor a cero');
      return;
    }

    setData('values', [...data.values, { ...newValue }]);
    setNewValue({
      payment_type: 'efectivo',
      amount: 0,
      currency: 'ARS',
      exchange_rate: 1.0,
    });
    setShowValueModal(false);
    toast.success('Valor agregado');
  };

  const removeValue = (index: number) => {
    setData('values', data.values.filter((_, i) => i !== index));
    toast.success('Valor eliminado');
  };

  // ==================== RETENCIONES ====================
  const [newWithholding, setNewWithholding] = useState<PaymentOrderWithholding>({
    tax_id: 0,
    percentage: 0,
    amount: 0,
    aliquot: 0,
  });

  const addWithholding = () => {
    if (newWithholding.tax_id === 0) {
      toast.error('Selecciona un impuesto');
      return;
    }
    if (newWithholding.amount <= 0) {
      toast.error('El monto debe ser mayor a cero');
      return;
    }

    setData('withholdings', [...data.withholdings, { ...newWithholding }]);
    setNewWithholding({
      tax_id: 0,
      percentage: 0,
      amount: 0,
      aliquot: 0,
    });
    setShowWithholdingModal(false);
    toast.success('Retención agregada');
  };

  const removeWithholding = (index: number) => {
    setData('withholdings', data.withholdings.filter((_, i) => i !== index));
    toast.success('Retención eliminada');
  };

  // ==================== CÁLCULOS ====================
  const totalValues = data.values.reduce((sum, v) => sum + Number(v.amount), 0);
  const totalWithholdings = data.withholdings.reduce((sum, w) => sum + Number(w.amount), 0);

  // ==================== SUBMIT ====================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.supplier_id === 0) {
      toast.error('Selecciona un destinatario');
      return;
    }

    post('/treasury/payment-orders', {
      onSuccess: () => toast.success('Orden de pago creada exitosamente'),
      onError: () => toast.error('Error al crear la orden de pago'),
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      efectivo: 'Efectivo',
      cheque_propio: 'Cheque Propio',
      cheque_terceros: 'Cheque de Terceros',
      transferencia: 'Transferencia Bancaria',
      tarjeta: 'Tarjeta',
      nota_credito: 'Nota de Crédito',
      nota_credito_interna: 'Nota de Crédito Interna',
      compensacion: 'Compensación',
    };
    return labels[type] || type;
  };

  return (
    <AppLayout>
      <Head title="Nueva Orden de Pago" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Nueva Orden de Pago</h1>
            <p className="text-muted-foreground">
              Registrar un nuevo pago a proveedor
            </p>
          </div>
          <Button variant="outline" onClick={() => router.visit('/treasury/payment-orders')}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Principales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ✅ CAMBIADO: Selector de Proveedor */}
                <div className="space-y-2">
                  <Label htmlFor="supplier_id">
                    Destinatario (Proveedor) <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.supplier_id.toString()}
                    onValueChange={(value) => setData('supplier_id', Number(value))}
                  >
                    <SelectTrigger className={errors.supplier_id ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.nombre} {supplier.apellido} - {supplier.documento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplier_id && (
                    <p className="text-sm text-destructive">{errors.supplier_id}</p>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Fecha <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={data.date}
                    onChange={(e) => setData('date', e.target.value)}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                {/* Concepto */}
                <div className="space-y-2">
                  <Label htmlFor="concept">
                    Concepto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="concept"
                    value={data.concept}
                    onChange={(e) => setData('concept', e.target.value)}
                    placeholder="Ej: COMBUSTIBLES Y LUBRICANTES"
                  />
                  {errors.concept && (
                    <p className="text-sm text-destructive">{errors.concept}</p>
                  )}
                </div>

                {/* Moneda */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
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

                {/* Cotización */}
                <div className="space-y-2">
                  <Label htmlFor="exchange_rate">Cotización</Label>
                  <Input
                    id="exchange_rate"
                    type="number"
                    step="0.0001"
                    value={data.exchange_rate}
                    onChange={(e) => setData('exchange_rate', Number(e.target.value))}
                  />
                </div>

                {/* Es Anticipo */}
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="is_advance"
                    checked={data.is_advance}
                    onCheckedChange={(checked) => setData('is_advance', checked as boolean)}
                  />
                  <Label htmlFor="is_advance" className="cursor-pointer">
                    Es Anticipo
                  </Label>
                </div>
              </div>

              {/* Detalle */}
              <div className="space-y-2">
                <Label htmlFor="detail">Detalle</Label>
                <Textarea
                  id="detail"
                  value={data.detail}
                  onChange={(e) => setData('detail', e.target.value)}
                  placeholder="Ej: CHEQUE 9931 - 9932"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Valores y Retenciones */}
          <Card>
            <CardHeader>
              <CardTitle>Valores y Retenciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="values">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="values">Valores Ingresados</TabsTrigger>
                  <TabsTrigger value="withholdings">Retenciones</TabsTrigger>
                </TabsList>

                {/* TAB: Valores Ingresados */}
                <TabsContent value="values" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Medios de pago utilizados
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowValueModal(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Agregar Valor
                    </Button>
                  </div>

                  {data.values.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo de Pago</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Cheque N°</TableHead>
                            <TableHead>Referencia</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.values.map((value, index) => (
                            <TableRow key={index}>
                              <TableCell>{getPaymentTypeLabel(value.payment_type)}</TableCell>
                              <TableCell className="font-medium">
                                ${Number(value.amount).toLocaleString('es-AR')}
                              </TableCell>
                              <TableCell>{value.check_number || '-'}</TableCell>
                              <TableCell>{value.reference || '-'}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeValue(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No hay valores agregados
                    </p>
                  )}

                  {/* Modal Agregar Valor */}
                  {showValueModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <Card className="w-full max-w-md">
                        <CardHeader>
                          <CardTitle>Agregar Valor de Pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Tipo de Pago</Label>
                            <Select
                              value={newValue.payment_type}
                              onValueChange={(value: any) =>
                                setNewValue({ ...newValue, payment_type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                <SelectItem value="cheque_propio">Cheque Propio</SelectItem>
                                <SelectItem value="cheque_terceros">Cheque de Terceros</SelectItem>
                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                <SelectItem value="nota_credito">Nota de Crédito</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Monto</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newValue.amount}
                              onChange={(e) =>
                                setNewValue({ ...newValue, amount: Number(e.target.value) })
                              }
                            />
                          </div>

                          {(newValue.payment_type === 'cheque_propio' ||
                            newValue.payment_type === 'cheque_terceros') && (
                            <>
                              <div className="space-y-2">
                                <Label>Número de Cheque</Label>
                                <Input
                                  value={newValue.check_number || ''}
                                  onChange={(e) =>
                                    setNewValue({ ...newValue, check_number: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Fecha de Cobro</Label>
                                <Input
                                  type="date"
                                  value={newValue.check_date || ''}
                                  onChange={(e) =>
                                    setNewValue({ ...newValue, check_date: e.target.value })
                                  }
                                />
                              </div>
                            </>
                          )}

                          <div className="space-y-2">
                            <Label>Referencia (Opcional)</Label>
                            <Input
                              value={newValue.reference || ''}
                              onChange={(e) =>
                                setNewValue({ ...newValue, reference: e.target.value })
                              }
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button type="button" onClick={addValue} className="flex-1">
                              Agregar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowValueModal(false)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* TAB: Retenciones */}
                <TabsContent value="withholdings" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Impuestos retenidos
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWithholdingModal(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Agregar Retención
                    </Button>
                  </div>

                  {data.withholdings.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Impuesto</TableHead>
                            <TableHead>Porcentaje</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.withholdings.map((withholding, index) => (
                            <TableRow key={index}>
                              <TableCell>Tax ID: {withholding.tax_id}</TableCell>
                              <TableCell>{withholding.percentage}%</TableCell>
                              <TableCell className="font-medium">
                                ${Number(withholding.amount).toLocaleString('es-AR')}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeWithholding(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No hay retenciones agregadas
                    </p>
                  )}

                  {/* ✅ CAMBIADO: Modal con selector de impuestos */}
                  {showWithholdingModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <Card className="w-full max-w-md">
                        <CardHeader>
                          <CardTitle>Agregar Retención</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Impuesto</Label>
                            <Select
                              value={newWithholding.tax_id.toString()}
                              onValueChange={(value) =>
                                setNewWithholding({
                                  ...newWithholding,
                                  tax_id: Number(value),
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un impuesto" />
                              </SelectTrigger>
                              <SelectContent>
                                {taxes.map((tax) => (
                                  <SelectItem key={tax.id} value={tax.id.toString()}>
                                    {tax.nombre} ({tax.codigo}) - {tax.porcentaje_default}%
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Porcentaje</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newWithholding.percentage}
                              onChange={(e) =>
                                setNewWithholding({
                                  ...newWithholding,
                                  percentage: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Monto</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newWithholding.amount}
                              onChange={(e) =>
                                setNewWithholding({
                                  ...newWithholding,
                                  amount: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button type="button" onClick={addWithholding} className="flex-1">
                              Agregar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowWithholdingModal(false)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Totales */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total Valores:</span>
                  <span className="font-bold">
                    ${totalValues.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total Retenciones:</span>
                  <span className="font-bold text-destructive">
                    -${totalWithholdings.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl">
                  <span className="font-bold">Monto Pagado:</span>
                  <span className="font-bold text-primary">
                    ${totalValues.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/treasury/payment-orders')}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              {processing ? 'Guardando...' : 'Guardar Orden de Pago'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
