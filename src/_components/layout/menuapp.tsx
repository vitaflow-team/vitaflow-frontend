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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function MenuApp() {
  const { data: session } = useSession();
  const user = session?.user;

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
          {APP_ROUTES.PRIVATE.map(ITEM => {
            if (!ITEM.PRODUCT_TYPE.includes(user?.productType as string)) {
              return null;
            }

            return (
              <SidebarMenuItem key={ITEM.TITLE}>
                <SidebarMenuButton
                  tooltip={ITEM.TITLE}
                  onClick={() => handleMenuButton(ITEM.URL)}
                  className="bg-transparent hover:bg-primary hover:text-secondary rounded-none"
                >
                  <ITEM.ICON />
                  <span>{ITEM.TITLE}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        {!isMobile && open && <SidebarTrigger />}
      </SidebarGroupContent>
    </Sidebar>
  );
}
