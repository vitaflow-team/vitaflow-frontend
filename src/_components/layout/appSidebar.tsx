'use client';

import { PlanBlock } from '@/_components/layout/planBlock';
import { UserBlock } from '@/_components/layout/userBlock';
import { Logo } from '@/_components/layout/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/_components/ui/sidebar';
import { APP_ROUTES } from '@/_constants/routes';
import { getMenuGroups, isRouteActive } from '@/_lib/navigation';
import type { PlanSummary } from '@/_lib/planSummary';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  productType?: string | null;
  firstName: string;
  avatar: string | null;
  plan: PlanSummary;
}

export function AppSidebar({
  productType,
  firstName,
  avatar,
  plan,
}: AppSidebarProps) {
  // O layout do app não volta a renderizar em navegação de cliente, então o item
  // ativo precisa sair do caminho atual, não de uma prop do servidor.
  const pathname = usePathname();
  const groups = getMenuGroups(productType);

  return (
    <Sidebar collapsible="icon" className="border-line">
      <SidebarHeader className="p-3">
        <div className="group-data-[collapsible=icon]:hidden">
          <Logo href={APP_ROUTES.ROUTE_PRIVATE} className="w-36" />
        </div>
        {/* Recolhida, a marca vira o monograma — um só destes dois fica visível
            por vez, então a árvore de acessibilidade enxerga um único link. */}
        <Link
          href={APP_ROUTES.ROUTE_PRIVATE}
          className="hidden size-8 items-center justify-center rounded-md font-display text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden group-data-[collapsible=icon]:flex"
        >
          <span aria-hidden="true">VF</span>
          <span className="sr-only">Vita Flow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Marco de navegação com rótulo próprio: a barra inferior é outro
            marco de navegação e os dois precisam ser distinguíveis. */}
        <nav aria-label="Menu principal">
          {groups.map(group => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => {
                    const active = isRouteActive(pathname, item.url);

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          // Peso da fonte e a barra à esquerda marcam o item
                          // atual sem depender de cor.
                          className="border-l-2 border-transparent data-[active=true]:border-primary data-[active=true]:font-semibold"
                        >
                          <Link
                            href={item.url}
                            aria-current={active ? 'page' : undefined}
                          >
                            <item.icon aria-hidden="true" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-line">
        <PlanBlock plan={plan} />
        <UserBlock firstName={firstName} avatar={avatar} />
      </SidebarFooter>
    </Sidebar>
  );
}
