import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ClientForm from '@/components/treasury/clients/ClientForm';
import type { Client } from '@/types/treasury';
import { useNotification } from '@/contexts/NotificationContext';
import { BreadcrumbItem } from '@/types';


interface Props {
  client: Client;
}

export default function EditClient({ client }: Props) {

  const { addNotification } = useNotification();

  const handleSubmit = (data: any) => {
    router.put(`/treasury/clients/${client.id}`, data, {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Cliente actualizado correctamente ✓',
          duration: 3000,
        });
        router.visit('/treasury/clients');
      },
      onError: (errors: any) => {
        addNotification({
          type: 'error',
          message: 'Error al actualizar el cliente',
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
      <Head title={`Editar ${client.full_name}`} />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
          <p className="text-muted-foreground mt-2">
            {client.full_name} ({client.codigo_interno})
          </p>
        </div>

        <ClientForm client={client} onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
}
