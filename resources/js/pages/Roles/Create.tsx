import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PlusCircle } from "lucide-react";
import { router } from '@inertiajs/react';
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"


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
        title: 'Roles create',
        href: '/roles',
    },
];
interface Props {
  permissions: {
    id: string;
    name: string;
    description?: string;
  }[];
}


export default function Create({ permissions }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Permisos seleccionados:', values.permissions);
    router.post('/roles', values)
  }
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Role" />
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold tracking-tight">Create Role</h1>
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

                <Button type="submit" className="w-full">Create Role</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
     { /*<div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Create Role</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>*/}
    </AppLayout>
    );
}
