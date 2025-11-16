import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from '@/utils/route';  
import { PlusCircle, Search, Edit, Eye, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Client, PaginatedResponse } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface Props {
  clients: PaginatedResponse<Client>;
  filters: {
    search?: string;
  };
}

export default function ClientsIndex({ clients, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('treasury.clients.index'),
      { search },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleDelete = (client: Client) => {
    if (
      confirm(
        `¿Estás seguro de eliminar al cliente ${client.full_name}?`
      )
    ) {
      router.delete(route('treasury.clients.destroy', client.id));
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, any> = {
      responsable_inscripto: 'default',
      monotributo: 'secondary',
      consumidor_final: 'outline',
      exento: 'destructive',
    };

    const labels: Record<string, string> = {
      responsable_inscripto: 'Resp. Inscripto',
      monotributo: 'Monotributo',
      consumidor_final: 'Cons. Final',
      exento: 'Exento',
      sin_informar: 'Sin Informar',
      no_alcanzado: 'No Alcanzado',
    };

    return (
      <Badge variant={variants[category] || 'outline'}>
        {labels[category] || category}
      </Badge>
    );
  };

   const breadcrumbs: BreadcrumbItem[] = [
                {
                    title: 'Clientes',
                    href: '/treasury/clients',
                },
            ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Gestión de clientes y proveedores
            </p>
          </div>
          <Button asChild>
            <Link href={route('treasury.clients.create')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar por nombre, documento o código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabla de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lista de Clientes ({clients.total} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Categoría Fiscal</TableHead>
                  <TableHead>Localidad</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <p className="text-muted-foreground">
                        No se encontraron clientes
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.data.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-mono text-sm">
                        {client.codigo_interno}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.full_name}</p>
                          {client.email && (
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{client.documento}</TableCell>
                      <TableCell>
                        {getCategoryBadge(client.categoria_fiscal)}
                      </TableCell>
                      <TableCell>{client.localidad}</TableCell>
                      <TableCell>
                        <span
                          className={
                            parseFloat(client.saldo) < 0
                              ? 'text-red-600 font-semibold'
                              : parseFloat(client.saldo) > 0
                              ? 'text-green-600 font-semibold'
                              : ''
                          }
                        >
                          ${parseFloat(client.saldo).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={route('treasury.clients.show', client.id)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link href={route('treasury.clients.edit', client.id)}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(client)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            {clients.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {clients.from} a {clients.to} de {clients.total}{' '}
                  resultados
                </p>
                <div className="flex gap-2">
                  {clients.current_page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.get(
                          route('treasury.clients.index', {
                            page: clients.current_page - 1,
                            search,
                          })
                        )
                      }
                    >
                      Anterior
                    </Button>
                  )}
                  {clients.current_page < clients.last_page && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.get(
                          route('treasury.clients.index', {
                            page: clients.current_page + 1,
                            search,
                          })
                        )
                      }
                    >
                      Siguiente
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
