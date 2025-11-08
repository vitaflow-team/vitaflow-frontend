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
      <SidebarProvider className="flex flex-col w-full py-2 px-2 xl:px-10 2xl:px-36 max-w-full">
        <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-secondary pb-2">
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger className="p-2 md:hidden" />
            <Logo />
          </div>
          <UserMenu />
        </header>
        <main className="flex flex-row flex-1 w-full max-w-full overflow-hidden">
          <div className="flex flex-row flex-1 w-full gap-1 max-w-full overflow-hidden">
            <MenuApp />
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </main>
        <Rights />
      </SidebarProvider>
    </UserSessionProvider>
  );
}
