'use client';

import { Breadcrumbs } from '@/_components/layout/breadcrumbs';
import { NotificationsBell } from '@/_components/layout/notificationsBell';
import { SidebarTrigger } from '@/_components/ui/sidebar';
import { getTopbarContext } from '@/_lib/navigation';
import { usePathname } from 'next/navigation';

export function Topbar() {
  const pathname = usePathname();
  const context = getTopbarContext(pathname);

  return (
    // Só a partir de md: abaixo disso quem manda é o MobileHeader. O gatilho da
    // barra lateral mora aqui, fora do alcance do celular, então a gaveta do
    // primitivo continua inacessível (ADR-007).
    <header className="hidden h-14 shrink-0 items-center justify-between gap-2 border-b border-line px-4 md:flex">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="size-8" />
        {context?.kind === 'trail' && <Breadcrumbs items={context.items} />}
        {context?.kind === 'title' && (
          <span className="truncate text-sm font-medium">{context.title}</span>
        )}
      </div>
      <NotificationsBell />
    </header>
  );
}
