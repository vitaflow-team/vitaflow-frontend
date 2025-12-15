import { Logo } from '@/_components/layout/logo';
import { NavLink } from '@/_components/layout/navLink';
import { PublicFooter } from '@/_components/layout/publicFooter';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full py-2 px-2 xl:px-10 2xl:px-36">
      <header className="flex flex-col sm:flex-row w-full justify-between items-center border-b-[1px] border-secondary pb-2">
        <Logo />

        <div className="flex w-full pt-2 sm:pt-0 mt-2 sm:mt-0 justify-center sm:justify-end gap-4 border-t-[1px] sm:border-t-0 border-secondary">
          <NavLink url="/">Home</NavLink>
          <NavLink url="/functions">Funcionalidades</NavLink>
          <NavLink url="/contact">Contato</NavLink>
          <NavLink url="/signin">Login</NavLink>
        </div>
      </header>
      <main className="flex h-full">{children}</main>
      <PublicFooter />
    </div>
  );
}
