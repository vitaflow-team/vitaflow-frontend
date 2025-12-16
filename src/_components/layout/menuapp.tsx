'use client';

import {
  Sidebar,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/_components/ui/sidebar';
import { APP_ROUTES } from '@/_constants/routes';
import { Apple, ChartNoAxesCombined, Dumbbell, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MenuApp() {
  const items = [
    {
      title: 'Início',
      url: APP_ROUTES.PRIVATE.DASHBOARD,
      icon: Home,
    },
    {
      title: 'Treinos',
      url: APP_ROUTES.PRIVATE.WORKOUTS,
      icon: Dumbbell,
    },
    {
      title: 'Nutrição',
      url: APP_ROUTES.PRIVATE.DASHBOARD,
      icon: Apple,
    },
    {
      title: 'Evolução',
      url: APP_ROUTES.PRIVATE.DASHBOARD,
      icon: ChartNoAxesCombined,
    },
  ];
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();
  const route = useRouter();

  function handleMenuButton(url: string) {
    route.push(url);
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="relative min-h-min h-full justify-center px-2 mr-0 md:mr-4"
    >
      {((isMobile && !openMobile) || (!isMobile && !open)) && (
        <SidebarTrigger className="w-full bg-transparent hover:bg-primary hover:text-secondary rounded-none" />
      )}
      <SidebarGroupContent className="flex flex-row w-full">
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => handleMenuButton(item.url)}
                className="bg-transparent hover:bg-primary hover:text-secondary rounded-none"
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {!isMobile && open && <SidebarTrigger />}
      </SidebarGroupContent>
    </Sidebar>
  );
}
