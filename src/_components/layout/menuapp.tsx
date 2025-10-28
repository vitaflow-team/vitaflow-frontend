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
import { Apple, ChartNoAxesCombined, Dumbbell, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MenuApp() {
  const items = [
    {
      title: 'Início',
      url: '/restrict',
      icon: Home,
    },
    {
      title: 'Treinos',
      url: '/restrict',
      icon: Dumbbell,
    },
    {
      title: 'Nutrição',
      url: '/restrict',
      icon: Apple,
    },
    {
      title: 'Evolução',
      url: '/restrict',
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
      className="relative min-h-min h-full justify-center px-2"
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
