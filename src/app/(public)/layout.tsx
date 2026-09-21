import { AccessNotice } from '@/_components/layout/accessNotice';
import { PublicFooter } from '@/_components/layout/publicFooter';
import { PublicNav } from '@/_components/layout/publicNav';
import { Suspense } from 'react';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      {/* Fim da linha da exclusão de conta: o usuário chega aqui já deslogado,
          então este é o único lugar que pode contar que deu certo (ADR-010).
          Suspense porque o componente lê `useSearchParams`. */}
      <Suspense fallback={null}>
        <AccessNotice />
      </Suspense>
      <PublicNav />
      <main
        id="main-content"
        className="flex flex-col h-full px-2 xl:px-10 2xl:px-36"
      >
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
