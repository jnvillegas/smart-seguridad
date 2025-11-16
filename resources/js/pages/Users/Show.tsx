import { Head, router } from '@inertiajs/react';
import { User, InertiaProps, BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from '@/layouts/app-layout';

interface Props {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

export default function Show({ user }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Details" />
            
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
                <Button 
                    onClick={() => router.get('/users')}
                    variant="outline"
                >
                    Back to Users
                </Button>
            </div>

            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium">Name</h3>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Email</h3>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Role</h3>
                            <p>{user.role}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Status</h3>
                            <Badge
                                variant={user.status === 'active' ? 'secondary' : 'destructive'}
                            >
                                {user.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}