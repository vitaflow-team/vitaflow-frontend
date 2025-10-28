import { Logo } from '@/_components/layout/logo';
import { MenuApp } from '@/_components/layout/menuapp';
import { Rights } from '@/_components/layout/rights';
import { UserMenu } from '@/_components/layout/userMenu';
import { SidebarProvider, SidebarTrigger } from '@/_components/ui/sidebar';
import { UserSessionProvider } from '@/_lib/sessionProvider';

export default function RestrictLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserSessionProvider>
      <SidebarProvider className="flex flex-col w-full py-2 px-2 xl:px-10 2xl:px-36">
        <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-secondary pb-2">
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger className="p-2 md:hidden" />
            <Logo />
          </div>{' '}
          <UserMenu />
        </header>
        <main className="flex flex-row h-full">
          <div className="flex flex-row w-full h-full gap-1">
            <MenuApp />
            <div className="flex flex-col w-full gap-2 lg:px-2">
              <main className="flex flex-col w-full h-full">{children}</main>
            </div>
          </div>
        </main>
        <Rights />
      </SidebarProvider>
    </UserSessionProvider>
  );
}
