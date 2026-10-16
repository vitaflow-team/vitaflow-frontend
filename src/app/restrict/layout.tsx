import { AccessNotice } from '@/_components/layout/accessNotice';
import { AppSidebar } from '@/_components/layout/appSidebar';
import { BottomNav } from '@/_components/layout/bottomNav';
import { MobileHeader } from '@/_components/layout/mobileHeader';
import { NotificationsBell } from '@/_components/layout/notificationsBell';
import { Topbar } from '@/_components/layout/topbar';
import { RestrictMain } from '@/_components/layout/restrictMain';
import { ViewAsBanner } from '@/_components/backoffice/viewAsBanner';
import { SidebarProvider } from '@/_components/ui/sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/_constants/sidebar';
import { effectiveAccountType } from '@/_lib/accountType';
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
  const accountType = effectiveAccountType(session?.user);

  return (
    <UserSessionProvider session={session}>
      <Suspense fallback={null}>
        <AccessNotice />
      </Suspense>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          productType={accountType}
          firstName={shell.firstName}
          avatar={shell.avatar}
          plan={plan}
        />
        <div className="flex min-h-svh w-full min-w-0 flex-col">
          <Suspense fallback={null}>
            <ViewAsBanner />
          </Suspense>
          <MobileHeader />
          <Topbar notificationsBell={<NotificationsBell />} />
          <RestrictMain>{children}</RestrictMain>
        </div>
        <BottomNav productType={accountType} />
      </SidebarProvider>
    </UserSessionProvider>
  );
}
