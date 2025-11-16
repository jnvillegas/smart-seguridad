import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useNotification } from '@/contexts/NotificationContext';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Client } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface Props {
  client: Client;
}

export default function ShowClient({ client }: Props) {
  const { addNotification } = useNotification();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    router.delete(`/treasury/clients/${client.id}`, {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Cliente eliminado correctamente ✓',
          duration: 3000,
        });
        router.visit('/treasury/clients');
      },
      onError: () => {
        addNotification({
          type: 'error',
          message: 'Error al eliminar el cliente',
          duration: 5000,
        });
      },
    });
  };

   const breadcrumbs: BreadcrumbItem[] = [
              {
                  title: 'Clientes',
                  href: '/treasury/clients',
              },
          ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={client.full_name} />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link href="/treasury/clients">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{client.full_name}</h1>
              <p className="text-muted-foreground mt-1">{client.codigo_interno}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/treasury/clients/${client.id}/edit`}>
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
          title="¿Eliminar cliente?"
          description={`Esta acción no se puede deshacer. Se eliminará permanentemente a ${client.full_name} y todos sus datos asociados.`}
          onConfirm={handleDelete}
          confirmText="Eliminar"
          cancelText="Cancelar"
          isDangerous={true}
        />

        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{client.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Apellido</p>
                <p className="font-medium">{client.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documento</p>
                <p className="font-medium">{client.documento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo Documento</p>
                <p className="font-medium">{client.tipo_documento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Persona</p>
                <p className="font-medium capitalize">{client.tipo_persona}</p>
              </div>
              {client.nombre_fantasia && (
                <div>
                  <p className="text-sm text-muted-foreground">Nombre Fantasía</p>
                  <p className="font-medium">{client.nombre_fantasia}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">¿Es Cliente?</p>
                <p className="font-medium">{client.es_cliente ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">¿Es Proveedor?</p>
                <p className="font-medium">{client.es_proveedor ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Fiscal */}
        <Card>
          <CardHeader>
            <CardTitle>Información Fiscal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Categoría Fiscal</p>
                <p className="font-medium capitalize">{client.categoria_fiscal}</p>
              </div>
              {client.nro_ingresos_brutos && (
                <div>
                  <p className="text-sm text-muted-foreground">Nº Ingresos Brutos</p>
                  <p className="font-medium">{client.nro_ingresos_brutos}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Gran Contribuyente</p>
                <p className="font-medium">{client.gran_contribuyente ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domicilio */}
        <Card>
          <CardHeader>
            <CardTitle>Domicilio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Domicilio</p>
                <p className="font-medium">{client.domicilio}</p>
              </div>
              {client.barrio && (
                <div>
                  <p className="text-sm text-muted-foreground">Barrio</p>
                  <p className="font-medium">{client.barrio}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Localidad</p>
                <p className="font-medium">{client.localidad}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {client.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              )}
              {client.telefono && (
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{client.telefono}</p>
                </div>
              )}
              {client.celular && (
                <div>
                  <p className="text-sm text-muted-foreground">Celular</p>
                  <p className="font-medium">{client.celular}</p>
                </div>
              )}
              {client.contacto && (
                <div>
                  <p className="text-sm text-muted-foreground">Contacto</p>
                  <p className="font-medium">{client.contacto}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              ${parseFloat(client.saldo || '0').toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

