import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import type { BankEntity, PaginatedResponse } from '@/types/treasury';
import { toast } from 'sonner';
import { route } from '@/utils/route';  
import { BreadcrumbItem } from '@/types';

interface Props {
  entities: PaginatedResponse<BankEntity>;
  filters: {
    search?: string;
    activo?: boolean;
  };
}

export default function Index({ entities, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('treasury.bank-entities.index'), { search }, { preserveState: true });
  };

  const handleDelete = (entity: BankEntity) => {
    if (!confirm(`¿Está seguro de eliminar la entidad bancaria "${entity.nombre}"?`)) return;

    router.delete(route('treasury.bank-entities.destroy', entity.id), {
      onSuccess: () => toast.success('Entidad bancaria eliminada correctamente'),
      onError: () => toast.error('Error al eliminar la entidad bancaria'),
    });
  };

     const breadcrumbs: BreadcrumbItem[] = [
                  {
                      title: 'Entidades Bancarias',
                      href: '/treasury/bank-entities',
                  },
              ];
              
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Entidades Bancarias" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Entidades Bancarias</h1>
            <p className="text-muted-foreground">Gestión de bancos y entidades financieras</p>
          </div>
          <Link href={route('treasury.bank-entities.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Entidad
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre, código BCRA o CUIT..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit">Buscar</Button>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Total: {entities.total} entidad{entities.total !== 1 ? 'es' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código BCRA</TableHead>
                  <TableHead>CUIT</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      <Building2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      No hay entidades bancarias registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  entities.data.map((entity) => (
                    <TableRow key={entity.id}>
                      <TableCell className="font-medium">{entity.nombre}</TableCell>
                      <TableCell>{entity.codigo_bcra || '-'}</TableCell>
                      <TableCell>{entity.cuit || '-'}</TableCell>
                      <TableCell>{entity.telefono || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={entity.activo ? 'default' : 'secondary'}>
                          {entity.activo ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('treasury.bank-entities.show', entity.id)}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={route('treasury.bank-entities.edit', entity.id)}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(entity)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
