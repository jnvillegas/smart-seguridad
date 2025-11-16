import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import React from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openMenus, setOpenMenus] = React.useState<string[]>([]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            {/*<SidebarGroupLabel>Platform</SidebarGroupLabel>*/}
            <SidebarMenu>
                {items.map((item) => {
                    const isSubMenuOpen = openMenus.includes(item.title);
                    const hasSubItems = item.items && item.items.length > 0;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={!hasSubItems}
                                isActive={page.url.startsWith(
                                    typeof item.href === 'string'
                                        ? item.href
                                        : item.href.url,
                                )}
                                tooltip={{ children: item.title }}
                                onClick={hasSubItems ? () => toggleMenu(item.title) : undefined}
                            >
                                {hasSubItems ? (
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronDown
                                            className={`transform transition-transform ${
                                                isSubMenuOpen ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </div>
                                ) : (
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                            {hasSubItems && isSubMenuOpen && (
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={subItem.href}>
                                                    {subItem.title}
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
