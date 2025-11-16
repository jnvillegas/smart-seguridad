import AppLayout from '@/layouts/app-layout';
//import { PageProps } from '@inertiajs/core';
//import { Page } from '@inertiajs/inertia';
import { User, InertiaProps, BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Eye, PlusCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
    roles: {
        id: number;
        name: string;
        description?: string;
        permissions: {
            id: number;
            name: string;
        }[];
    }[];
}

type PageWithProps = Page<InertiaProps & Props>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: PageWithProps) {
      const handleCreateRole = () => {
        router.get('/roles/create');
    };
    const handleShow = (id: number) => {
    router.visit(`/roles/${id}`);
    };
    const handleEdit = (id: number) => {
        router.get(`/roles/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/roles/${id}`);
        }
    };
    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex items-center justify-between p-4">
                <h1 className="text-2xl font-bold tracking-tight">Roles Management</h1>
                <Button
                    onClick={handleCreateRole}
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    Create Role
                </Button>
            </div>

            <div className="p-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>{role.description || 'N/A'}</TableCell>
                                    <TableCell>
                                        {role.permissions.map((permission) => (
                                            <Badge key={permission.id} className="mr-2">
                                                {permission.name}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleShow(role.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(role.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(role.id)}
                                                    className="cursor-pointer text-destructive"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
