import { Logo } from '@/_components/layout/logo';
import { NotificationsBell } from '@/_components/layout/notificationsBell';
import { UserMenu } from '@/_components/layout/userMenu';
import { APP_ROUTES } from '@/_constants/routes';

/**
 * Cabeçalho do celular: marca, sino e o menu do avatar com "Configurações" e
 * "Sair". Sem hambúrguer — os destinos ficam na barra inferior (ADR-005).
 */
export function MobileHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line px-3 md:hidden">
      <Logo href={APP_ROUTES.ROUTE_PRIVATE} className="w-28" />
      <div className="flex items-center gap-1">
        <NotificationsBell />
        <UserMenu />
      </div>
    </header>
  );
}
