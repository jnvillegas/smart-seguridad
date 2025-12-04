import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    UsersRound,
    Receipt,
    Building2,
    CreditCard,
    Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

// 🔵 SECCIÓN PLATAFORMA
const platformNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersRound,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Folder,
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: BookOpen,
    },
];

// 🟢 SECCIÓN MÓDULOS
const modulesNavItems: NavItem[] = [
    {
        title: 'Tesorería',
        href: '#',
        icon: Wallet,
        items: [
            {
                title: 'Clientes',
                href: '/treasury/clients',
                icon: UsersRound,
            },
            {
                title: 'Recibos',
                href: '/treasury/receipts',
                icon: Receipt,
            },
            {
                title: 'Bancos',
                href: '/treasury/bank-entities',
                icon: Building2,
            },
            {
                title: 'Cuentas Bancarias',
                href: '/treasury/bank-accounts',
                icon: CreditCard,
            },
            {
                title: 'Ordenes de Pago',
                href: '/treasury/payment-orders',
                icon: CreditCard,
            },
            {
                title: 'Egresos de Caja',
                href: '/treasury/cash-withdrawals',
                icon: CreditCard, // o el icono que uses
            }

        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* 🔵 SECCIÓN PLATAFORMA */}
                <SidebarGroup>
                    <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <NavMain items={platformNavItems} />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* 🟢 SECCIÓN MÓDULOS */}
                <SidebarGroup>
                    <SidebarGroupLabel>Módulos</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <NavMain items={modulesNavItems} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
