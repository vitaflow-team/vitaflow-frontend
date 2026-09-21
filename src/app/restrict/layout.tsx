import { AccessNotice } from '@/_components/layout/accessNotice';
import { AppSidebar } from '@/_components/layout/appSidebar';
import { BottomNav } from '@/_components/layout/bottomNav';
import { MobileHeader } from '@/_components/layout/mobileHeader';
import { Topbar } from '@/_components/layout/topbar';
import { SidebarProvider } from '@/_components/ui/sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/_constants/sidebar';
import { getPlanSummary } from '@/_lib/planSummary';
import { UserSessionProvider } from '@/_lib/sessionProvider';
import { getShellData } from '@/_lib/shellData';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export default async function RestrictLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const [shell, cookieStore] = await Promise.all([
    getShellData(session),
    cookies(),
  ]);

  // Ler o cookie aqui é o que faz a escolha de recolher a barra sobreviver ao
  // recarregamento e já sair certa na primeira pintura (ADR-007).
  const defaultOpen = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== 'false';

  // Sem perfil carregado o bloco mostra um rótulo neutro em vez de afirmar que
  // a conta é do plano gratuito.
  const plan = getPlanSummary(shell.profileLoaded ? shell : null);

  return (
    <UserSessionProvider session={session}>
      <Suspense fallback={null}>
        <AccessNotice />
      </Suspense>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          productType={session?.user?.productType}
          firstName={shell.firstName}
          avatar={shell.avatar}
          plan={plan}
        />
        <div className="flex min-h-svh w-full min-w-0 flex-col">
          <MobileHeader />
          <Topbar />
          {/* Alvo do link "Pular para o conteúdo" do layout raiz. O espaço
              embaixo reserva a altura da barra inferior mais a área segura do
              aparelho, e some a partir de md, onde a barra não existe. */}
          <main
            id="main-content"
            className="flex min-w-0 flex-1 flex-col px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:px-6 md:pb-6"
          >
            {children}
          </main>
        </div>
        <BottomNav productType={session?.user?.productType} />
      </SidebarProvider>
    </UserSessionProvider>
  );
}
