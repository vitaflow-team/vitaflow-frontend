import { Logo } from "@/components/layout/logo";
import { PublicFooter } from "@/components/layout/publicFooter";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-8 w-full py-2 md:py-4 px-2 xl:px-36">

      <header className="flex w-full justify-between items-center">
        <Logo />
        
        <div className="hidden md:block">
          <span>Home</span>
          <span>Funcionalidades</span>
          <span>Profissionais</span>
          <span>Usuários</span>
          <span>Contato</span>
        </div>

        <Button>Login</Button>
      </header>

      <main className="flex h-full">
        {children}
      </main>
      
      <PublicFooter />
    </div>
  );
}
