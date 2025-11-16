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
    users: {
        id: number;
        name: string;
        email: string;
        status: 'active' | 'inactive';
        roles: { name: string }[];
    }[];
}

type PageWithProps = Page<InertiaProps & Props>;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({ users }: PageWithProps) {
      const handleCreateUser = () => {
        router.get('/users/create');
    };
    const handleShow = (id: number) => {
    router.visit(`/users/${id}`);
    };
    const handleEdit = (id: number) => {
        router.get(`/users/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/users/${id}`);
        }
    };
    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
                <Button 
                    onClick={handleCreateUser}
                    className="flex items-center gap-2"
                >
                    <PlusCircle className="h-4 w-4" />
                    Create User
                </Button>
            </div>

            <div className="p-6">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.roles[0]?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'active' ? 'secondary' : 'destructive'}
                                        >
                                            {user.status}
                                        </Badge>
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
                                                    onClick={() => handleShow(user.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(user.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id)}
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
