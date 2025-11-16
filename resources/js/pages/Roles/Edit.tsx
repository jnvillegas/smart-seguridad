import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Head, router } from '@inertiajs/react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Actualizar interfaces para roles
interface Permission {
  id: string;
  name: string;
  description?: string;
}

interface Props {
  role: {
    id: number;
    name: string;
    permissions: Permission[];
  };
  permissions: Permission[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  permissions: z.array(z.string()).min(1, {
    message: "Select at least one permission.",
  }),
})

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Roles',
    href: '/roles',
  },
  {
    title: 'Edit Role',
    href: '#',
  },
]

export default function Edit({ role, permissions }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name,
      permissions: role.permissions.map(p => p.id),
    },
  })

function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
        name: values.name,
        permissions: values.permissions,
    };

    console.log('Submitting form data:', formData);

    router.put(`/roles/${role.id}`, formData, {
        preserveState: true,
        preserveScroll: true,
        onBefore: () => {
            console.log('Before submitting update...');
            return true;
        },
        onError: (errors: any) => {
            console.log('Update errors:', errors);
            
            if (typeof errors === 'string') {
                form.setError('root', { 
                    type: 'manual',
                    message: errors 
                });
                return;
            }

            Object.keys(errors).forEach(key => {
                form.setError(key as any, {
                    type: 'manual',
                    message: Array.isArray(errors[key]) 
                        ? errors[key][0] 
                        : errors[key]
                });
            });
        },
        onSuccess: () => {
            console.log('Update successful');
            router.visit('/roles');
        },
    });
}
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Role" />

      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold tracking-tight">Edit Role</h1>
        <Button
          onClick={() => router.get('/roles')}
          variant="outline"
        >
          Back to Roles
        </Button>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {form.formState.errors.root.message}
                  </div>
                )}
                 {form.formState.errors.root && (
            <div className="p-4 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
                {form.formState.errors.root.message}
            </div>
        )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Role name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Permissions</FormLabel>
                      </div>
                      <ScrollArea className="h-72 rounded-md border p-4">
                        <div className="grid grid-cols-2 gap-4">
                          {permissions.map((permission) => (
                            <FormField
                              key={permission.id}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={permission.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(permission.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, permission.id])
                                            : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== permission.id
                                              )
                                            )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">
                                        {permission.name}
                                      </FormLabel>
                                      {permission.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <Button 
            type="submit" 
            className="w-full"
            disabled={form.formState.isSubmitting}
        >
            {form.formState.isSubmitting ? "Updating..." : "Update Role"}
        </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}