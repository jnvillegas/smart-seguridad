import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Building2, Phone, Mail, Globe, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { BankEntity } from '@/types/treasury';
import { route } from '@/utils/route';  
import { BreadcrumbItem } from '@/types';

interface Props {
  entity: BankEntity;
}

export default function Show({ entity }: Props) {
  const handleDelete = () => {
    if (!confirm(`¿Está seguro de eliminar la entidad bancaria "${entity.nombre}"?`)) return;

    router.delete(route('treasury.bank-entities.destroy', entity.id), {
      onSuccess: () => {
        toast.success('Entidad bancaria eliminada correctamente');
        router.visit(route('treasury.bank-entities.index'));
      },
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
      <Head title={`Entidad Bancaria - ${entity.nombre}`} />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('treasury.bank-entities.index')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{entity.nombre}</h1>
              <p className="text-muted-foreground">Detalle de la entidad bancaria</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={route('treasury.bank-entities.edit', entity.id)}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="text-base font-medium">{entity.nombre}</p>
              </div>

              {/* Estado */}
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge variant={entity.activo ? 'default' : 'secondary'}>
                  {entity.activo ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>

              {/* Código BCRA */}
              <div>
                <p className="text-sm text-muted-foreground">Código BCRA</p>
                <p className="text-base font-medium">{entity.codigo_bcra || '-'}</p>
              </div>

              {/* CUIT */}
              <div>
                <p className="text-sm text-muted-foreground">CUIT</p>
                <p className="text-base font-medium">{entity.cuit || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="text-base font-medium">{entity.telefono || '-'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  {entity.email ? (
                    <a href={`mailto:${entity.email}`} className="text-base font-medium text-primary hover:underline">
                      {entity.email}
                    </a>
                  ) : (
                    <p className="text-base font-medium">-</p>
                  )}
                </div>
              </div>

              {/* Sitio Web */}
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Sitio Web</p>
                  {entity.web ? (
                    <a href={entity.web} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-primary hover:underline">
                      {entity.web}
                    </a>
                  ) : (
                    <p className="text-base font-medium">-</p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="text-base font-medium">{entity.direccion || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuentas Bancarias */}
        {entity.accounts && entity.accounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Cuentas Bancarias ({entity.accounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entity.accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{account.numero_cuenta}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.tipo_cuenta.replace('_', ' ')} - {account.moneda}
                      </p>
                    </div>
                    <Link href={route('treasury.bank-accounts.show', account.id)}>
                      <Button variant="outline" size="sm">Ver Detalle</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

