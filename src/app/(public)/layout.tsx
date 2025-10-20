import { Logo } from '@/_components/layout/logo';
import { NavLink } from '@/_components/layout/navLink.tsx';
import { PublicFooter } from '@/_components/layout/publicFooter';
import { Great_Vibes } from 'next/font/google';

const fontGreat = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
});

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full py-2 px-2 xl:px-10 2xl:px-36">
      <header className="flex w-full justify-between items-center border-b-[1px] border-secondary pb-2">
        <Logo />

        <div className="hidden md:flex gap-4">
          <NavLink url="/">Home</NavLink>
          <NavLink url="/functions">Funcionalidades</NavLink>
          <NavLink url="/contact">Contato</NavLink>
          <NavLink url="/singin">Login</NavLink>
        </div>
      </header>

      <main className="flex h-full">{children}</main>

      <PublicFooter />
    </div>
  );
}
