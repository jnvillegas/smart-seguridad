import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Receipt, Building2, Wallet, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import type { Receipt as ReceiptType } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface DashboardStats {
    clients: {
        total: number;
        active: number;
    };
    receipts: {
        total: number;
        pending: number;
        paid: number;
        total_amount: number;
    };
    banks: {
        entities: number;
        accounts: number;
        total_balance: number;
    };
}

interface Props {
    stats: DashboardStats;
    recentReceipts: ReceiptType[];
}

export default function Dashboard({ stats, recentReceipts }: Props) {
    const formatCurrency = (amount: number | string) => {
        return parseFloat(amount.toString()).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Vista general del sistema ERP
                    </p>
                </div>

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Clientes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Clientes
                            </CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.clients.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.clients.active} activos
                            </p>
                        </CardContent>
                    </Card>

                    {/* Recibos Pendientes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Recibos Pendientes
                            </CardTitle>
                            <Clock className="w-4 h-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.receipts.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                de {stats.receipts.total} totales
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Cobrado */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Cobrado
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${formatCurrency(stats.receipts.total_amount)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.receipts.paid} recibos pagados
                            </p>
                        </CardContent>
                    </Card>

                    {/* Saldo Bancario */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Saldo Bancario Total
                            </CardTitle>
                            <Wallet className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${formatCurrency(stats.banks.total_balance)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.banks.accounts} cuentas activas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Módulos Tesorería */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Bancos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.banks.entities}</p>
                            <p className="text-sm text-muted-foreground">Entidades activas</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-green-600" />
                                Recibos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.receipts.total}</p>
                            <p className="text-sm text-muted-foreground">Total registrados</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Clientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.clients.total}</p>
                            <p className="text-sm text-muted-foreground">En la base de datos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Últimos Recibos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Recibos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentReceipts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No hay recibos registrados
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentReceipts.map((receipt) => (
                                        <TableRow key={receipt.id}>
                                            <TableCell className="font-medium">
                                                {receipt.numerorecibo}
                                            </TableCell>
                                            <TableCell>
                                                {receipt.client?.nombre} {receipt.client?.apellido}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(receipt.fecharecibo).toLocaleDateString('es-AR')}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(receipt.estado)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                ${formatCurrency(receipt.total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
