import type { ReactNode } from 'react';

interface RestrictMainProps {
  children: ReactNode;
}

// Alvo do link "Pular para o conteúdo" do layout raiz. O espaço embaixo
// reserva a altura da barra inferior mais a área segura do aparelho, e some
// a partir de md, onde a barra não existe.
export function RestrictMain({ children }: RestrictMainProps) {
  return (
    <main
      id="main-content"
      className="flex min-w-0 flex-1 flex-col px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:px-6 md:pb-6"
    >
      {children}
    </main>
  );
}
