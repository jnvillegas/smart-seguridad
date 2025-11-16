import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ClientForm from '@/components/treasury/clients/ClientForm';
import { useNotification } from '@/contexts/NotificationContext';
import { BreadcrumbItem } from '@/types';

export default function CreateClient() {
  const { addNotification } = useNotification();

  const handleSubmit = (data: any) => {
    router.post('/treasury/clients', data, {
      onSuccess: () => {
        addNotification({
          type: 'success',
          message: 'Cliente creado correctamente ✓',
          duration: 3000,
        });
        router.visit('/treasury/clients');
      },
      onError: (errors: any) => {
        addNotification({
          type: 'error',
          message: 'Error al crear el cliente',
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
      <Head title="Crear Cliente" />

      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crear Cliente</h1>
          <p className="text-muted-foreground mt-2">
            Agregar un nuevo cliente al sistema
          </p>
        </div>

        <ClientForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
}
