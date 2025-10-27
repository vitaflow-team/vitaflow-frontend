import { Logo } from '@/_components/layout/logo';
import { Rights } from '@/_components/layout/rights';
import { UserMenu } from '@/_components/layout/userMenu';
import { UserSessionProvider } from '@/_lib/sessionProvider';

export default function RestrictLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserSessionProvider>
      <div className="flex flex-col w-full py-2 px-2 xl:px-10 2xl:px-36">
        <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-secondary pb-2">
          <Logo />

          <UserMenu />
        </header>
        <main className="flex flex-row h-full">
          <div className="flex w-50">menu</div>
          <div>{children}</div>
        </main>
        <Rights />
      </div>
    </UserSessionProvider>
  );
}
