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
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useNotification } from '@/contexts/NotificationContext';
import { ArrowLeft, Edit, Trash2, Download, Printer } from 'lucide-react';
import { useState } from 'react';
import type { Receipt } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface Props {
    receipt: Receipt;
}

export default function ShowReceipt({ receipt }: Props) {
    const { addNotification } = useNotification();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = () => {
        router.delete(`/treasury/receipts/${receipt.id}`, {
            onSuccess: () => {
                addNotification({
                    type: 'success',
                    message: 'Recibo eliminado correctamente ✓',
                    duration: 3000,
                });
                router.visit('/treasury/receipts');
            },
            onError: () => {
                addNotification({
                    type: 'error',
                    message: 'Error al eliminar el recibo',
                    duration: 5000,
                });
            },
        });
    };

    const getStatusBadge = (estado: string) => {
        const styles = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            pagado: 'bg-green-100 text-green-800',
            cancelado: 'bg-red-100 text-red-800',
        };

        const labels = {
            pendiente: 'Pendiente',
            pagado: 'Pagado',
            cancelado: 'Cancelado',
        };

        return (
            <Badge className={styles[estado as keyof typeof styles]}>
                {labels[estado as keyof typeof labels]}
            </Badge>
        );
    };

    const getPaymentMethod = (method: string) => {
        const methods = {
            efectivo: 'Efectivo',
            cheque: 'Cheque',
            transferencia: 'Transferencia',
            tarjeta: 'Tarjeta',
            otro: 'Otro',
        };
        return methods[method as keyof typeof methods] || method;
    };

     const breadcrumbs: BreadcrumbItem[] = [
            {
                title: 'Recibos',
                href: '/treasury/receipts',
            },
        ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={receipt.numero_recibo} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/treasury/receipts">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {receipt.numero_recibo}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                {receipt.client?.nombre} {receipt.client?.apellido}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Printer className="w-4 h-4" />
                        </Button>
                        <a href={`/treasury/receipts/${receipt.id}/download-pdf`} download>
                            <Button variant="outline" size="icon">
                                <Download className="w-4 h-4" />
                            </Button>
                        </a>

                        <Link href={`/treasury/receipts/${receipt.id}/edit`}>
                            <Button variant="outline" className="gap-2">
                                <Edit className="w-4 h-4" />
                                Editar
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => setIsConfirmOpen(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Diálogo de Confirmación */}
                <ConfirmDialog
                    open={isConfirmOpen}
                    onOpenChange={setIsConfirmOpen}
                    title="¿Eliminar recibo?"
                    description={`Esta acción no se puede deshacer. Se eliminará permanentemente el recibo ${receipt.numero_recibo} y todos sus datos asociados.`}
                    onConfirm={handleDelete}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    isDangerous={true}
                />

                {/* Información General */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Número de Recibo</p>
                                <p className="font-medium">{receipt.numero_recibo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="font-medium">
                                    {new Date(receipt.fecha_recibo).toLocaleDateString('es-AR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Cliente</p>
                                <p className="font-medium">
                                    {receipt.client?.nombre} {receipt.client?.apellido}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estado</p>
                                {getStatusBadge(receipt.estado)}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Método de Pago</p>
                                <p className="font-medium">{getPaymentMethod(receipt.metodo_pago)}</p>
                            </div>
                            {receipt.referencia && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Referencia</p>
                                    <p className="font-medium">{receipt.referencia}</p>
                                </div>
                            )}
                            {receipt.concepto && (
                                <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Concepto</p>
                                    <p className="font-medium">{receipt.concepto}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Conceptos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead className="text-right">Cantidad</TableHead>
                                    <TableHead className="text-right">Precio Unitario</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receipt.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.descripcion}</TableCell>
                                        <TableCell className="text-right">{item.cantidad}</TableCell>
                                        <TableCell className="text-right">
                                            ${parseFloat(item.precio_unitario).toLocaleString('es-AR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${parseFloat(item.subtotal).toLocaleString('es-AR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Totales */}
                <Card>
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Subtotal:</p>
                            <p className="font-medium">
                                ${parseFloat(receipt.subtotal).toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Impuesto:</p>
                            <p className="font-medium">
                                ${parseFloat(receipt.impuesto).toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="flex justify-between items-center border-t pt-3">
                            <p className="text-xl font-semibold">TOTAL:</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ${parseFloat(receipt.total).toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Observaciones */}
                {receipt.observaciones && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Observaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{receipt.observaciones}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
