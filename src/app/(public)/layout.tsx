import { Logo } from "@/_components/layout/logo";
import { PublicFooter } from "@/_components/layout/publicFooter";
import { Great_Vibes } from "next/font/google";

const fontGreat = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-satisfy",
});

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full py-2 px-2 xl:px-36">

      <header className="flex w-full justify-between items-center border-b-[1px] border-secondary pb-2">
        <Logo />

        <div className="hidden md:flex gap-4">
          <span>Home</span>
          <span>Funcionalidades</span>
          <span>Profissionais</span>
          <span>Usuários</span>
          <span>Contato</span>
          <span>Cadastre-se</span>
          <span>Login</span>
        </div>
      </header>

      <main className="flex h-full">
        {children}
      </main>
      
      <PublicFooter />
    </div>
  );
}
