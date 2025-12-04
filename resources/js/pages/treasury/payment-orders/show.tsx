import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pencil, FileDown, Trash2 } from 'lucide-react';
import { PaymentOrder } from '@/types/treasury';
import { toast } from 'sonner';

interface Props {
  paymentOrder: PaymentOrder;
}

export default function Show({ paymentOrder }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      en_proceso: 'secondary',
      cerrada: 'default',
      anulada: 'destructive',
    };

    return (
      <Badge variant={variants[paymentOrder.status] || 'default'} className="text-base px-4 py-1">
        {paymentOrder.status_label}
      </Badge>
    );
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

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta orden de pago?')) {
      router.delete(`/treasury/payment-orders/${paymentOrder.id}`, {
        onSuccess: () => {
          toast.success('Orden de pago eliminada');
          router.visit('/treasury/payment-orders');
        },
        onError: () => toast.error('Error al eliminar la orden'),
      });
    }
  };

  const handleChangeStatus = (newStatus: string) => {
    router.post(
      `/treasury/payment-orders/${paymentOrder.id}/change-status`,
      { status: newStatus },
      {
        onSuccess: () => toast.success('Estado actualizado'),
        onError: () => toast.error('Error al actualizar el estado'),
      }
    );
  };

  return (
    <AppLayout>
      <Head title={`Orden de Pago ${paymentOrder.number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/treasury/payment-orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Orden de Pago {paymentOrder.number}</h1>
              <p className="text-muted-foreground">
                Creada el {formatDate(paymentOrder.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {paymentOrder.status === 'en_proceso' && (
              <>
                <Link href={`/treasury/payment-orders/${paymentOrder.id}/edit`}>
                  <Button variant="outline">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
                <Button onClick={() => handleChangeStatus('cerrada')}>
                  Cerrar Orden
                </Button>
              </>
            )}

            {paymentOrder.status === 'cerrada' && (
              <>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button variant="destructive" onClick={() => handleChangeStatus('anulada')}>
                  Anular
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Principal */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información de la Orden</CardTitle>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Destinatario</p>
                    <p className="font-medium">
                      {paymentOrder.supplier?.nombre} {paymentOrder.supplier?.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{formatDate(paymentOrder.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Concepto</p>
                    <p className="font-medium">{paymentOrder.concept}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Empleado</p>
                    <p className="font-medium">{paymentOrder.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Moneda</p>
                    <p className="font-medium">{paymentOrder.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cotización</p>
                    <p className="font-medium">${paymentOrder.exchange_rate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Es Anticipo</p>
                    <p className="font-medium">
                      {paymentOrder.is_advance ? (
                        <Badge variant="secondary">Sí</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </p>
                  </div>
                </div>

                {paymentOrder.detail && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Detalle</p>
                      <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                        {paymentOrder.detail}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Valores Ingresados */}
            <Card>
              <CardHeader>
                <CardTitle>Valores Ingresados</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentOrder.values && paymentOrder.values.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo de Pago</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Cheque N°</TableHead>
                          <TableHead>Fecha Cobro</TableHead>
                          <TableHead>Entidad</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentOrder.values.map((value, index) => (
                          <TableRow key={index}>
                            <TableCell>{getPaymentTypeLabel(value.payment_type)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(value.amount)}
                            </TableCell>
                            <TableCell>{value.check_number || '-'}</TableCell>
                            <TableCell>
                              {value.check_date
                                ? new Date(value.check_date).toLocaleDateString('es-AR')
                                : '-'}
                            </TableCell>
                            <TableCell>{value.bank_entity?.name || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No hay valores ingresados
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Retenciones */}
            {paymentOrder.withholdings && paymentOrder.withholdings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Retenciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Impuesto</TableHead>
                          <TableHead>Porcentaje</TableHead>
                          <TableHead>Alícuota</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentOrder.withholdings.map((withholding, index) => (
                          <TableRow key={index}>
                            <TableCell>{withholding.tax?.name || 'N/A'}</TableCell>
                            <TableCell>{withholding.percentage}%</TableCell>
                            <TableCell>{withholding.aliquot}%</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(withholding.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Lateral - Totales */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(paymentOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retenciones:</span>
                    <span className="font-medium text-destructive">
                      -{formatCurrency(paymentOrder.total_withholdings)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{formatCurrency(paymentOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Monto Pagado:</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(paymentOrder.amount_paid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo:</span>
                    <span className="font-medium">{formatCurrency(paymentOrder.balance)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Creado por</p>
                  <p className="font-medium">{paymentOrder.user?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha de creación</p>
                  <p className="font-medium">{formatDate(paymentOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última modificación</p>
                  <p className="font-medium">{formatDate(paymentOrder.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
