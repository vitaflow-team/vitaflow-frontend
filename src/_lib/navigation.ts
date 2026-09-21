import { APP_ROUTES, type AppRoute } from '@/_constants/routes';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  shortTitle?: string;
  url: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  label: string;
  items: NavItem[];
}

export type TopbarContext =
  | { kind: 'title'; title: string }
  | { kind: 'trail'; items: { label: string; href?: string }[] };

/**
 * Quantos destinos a barra inferior mostra, incluindo "Conta". Cinco cabem em
 * 375 px acima do alvo mínimo de toque, e é o que um profissional precisa para
 * não perder nenhuma seção (ADR-007).
 */
const BOTTOM_NAV_MAX_ITEMS = 5;

const BRAND_LABEL = 'Vita Flow';

/**
 * Uma seção está ativa quando o caminho é igual à sua rota ou está abaixo dela,
 * comparando segmentos inteiros — `/restrict/workouts-archive` não acende
 * "Treinos". A raiz é exceção: só acende no caminho exato, senão acenderia em
 * toda página do app.
 */
export function isRouteActive(pathname: string, url: string): boolean {
  if (url === APP_ROUTES.ROUTE_PRIVATE) {
    return pathname === url;
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

/**
 * Rotas em EXCLUDED_ROUTES são liberadas para qualquer conta autenticada, então
 * aparecem no menu mesmo para quem ainda não tem tipo de produto.
 */
function isRouteVisible(route: AppRoute, productType?: string | null): boolean {
  return (
    APP_ROUTES.EXCLUDED_ROUTES.includes(route.URL) ||
    route.PRODUCT_TYPE.includes(productType ?? '')
  );
}

/**
 * Os rótulos das seções que um tipo enxerga, pela mesma regra do menu. É daqui
 * que o resumo de troca de plano tira o que se ganha e o que se perde, para que
 * a cópia não possa divergir da tabela de rotas (ADR-010).
 */
export function sectionsForType(productType?: string | null): string[] {
  return APP_ROUTES.PRIVATE.filter(route =>
    isRouteVisible(route, productType)
  ).map(route => route.TITLE);
}

function toNavItem(route: AppRoute): NavItem {
  return {
    title: route.TITLE,
    shortTitle: route.SHORT_TITLE,
    url: route.URL,
    icon: route.ICON,
  };
}

function toShortNavItem(route: AppRoute): NavItem {
  return {
    title: route.SHORT_TITLE ?? route.TITLE,
    shortTitle: route.SHORT_TITLE,
    url: route.URL,
    icon: route.ICON,
  };
}

export function getMenuGroups(productType?: string | null): MenuGroup[] {
  return [
    {
      label: 'Meu dia',
      items: APP_ROUTES.PRIVATE.filter(route =>
        isRouteVisible(route, productType)
      ).map(toNavItem),
    },
    {
      label: 'Conta',
      items: APP_ROUTES.ACCOUNT.filter(route =>
        isRouteVisible(route, productType)
      ).map(toNavItem),
    },
  ];
}

/**
 * As seções permitidas (com rótulo curto quando existe) seguidas de "Conta",
 * que fecha a barra e nunca é cortada.
 */
export function getBottomNavItems(
  productType?: string | null,
  routes: AppRoute[] = APP_ROUTES.PRIVATE
): NavItem[] {
  const account = APP_ROUTES.ACCOUNT.filter(route =>
    isRouteVisible(route, productType)
  ).map(toShortNavItem);

  const sections = routes
    .filter(route => isRouteVisible(route, productType))
    .slice(0, BOTTOM_NAV_MAX_ITEMS - account.length)
    .map(toShortNavItem);

  return [...sections, ...account];
}

interface SectionDescriptor {
  /** Rótulo da seção no rastro e no título simples. */
  label: string;
  /** Rótulo genérico do filho; sem ele a seção não tem páginas aninhadas. */
  childLabel?: string;
}

const SECTIONS: Record<string, SectionDescriptor> = {
  clients: { label: PAGE_TITLES.clients, childLabel: PAGE_TITLES.client },
  workouts: {
    label: PAGE_TITLES.workouts,
    childLabel: PAGE_TITLES.workoutForm,
  },
  progress: { label: PAGE_TITLES.progress },
  settings: { label: PAGE_TITLES.settings },
};

/**
 * Rastro completo só para páginas com dois níveis ou mais abaixo da raiz
 * (ADR-002). Páginas de primeiro nível devolvem apenas o nome da página, e
 * caminhos desconhecidos não devolvem nada — melhor nada do que um rastro que
 * mente sobre a hierarquia.
 */
export function getTopbarContext(pathname: string): TopbarContext | null {
  if (pathname === APP_ROUTES.ROUTE_PRIVATE) {
    return { kind: 'title', title: PAGE_TITLES.home };
  }

  if (!pathname.startsWith(`${APP_ROUTES.ROUTE_PRIVATE}/`)) {
    return null;
  }

  const segments = pathname
    .slice(APP_ROUTES.ROUTE_PRIVATE.length + 1)
    .split('/')
    .filter(segment => segment.length > 0);

  const section = SECTIONS[segments[0]];
  if (!section || segments.length > 2) {
    return null;
  }

  if (segments.length === 1) {
    return { kind: 'title', title: section.label };
  }

  if (!section.childLabel) {
    return null;
  }

  return {
    kind: 'trail',
    items: [
      { label: BRAND_LABEL, href: APP_ROUTES.ROUTE_PRIVATE },
      {
        label: section.label,
        href: `${APP_ROUTES.ROUTE_PRIVATE}/${segments[0]}`,
      },
      { label: section.childLabel },
    ],
  };
}

export function getFirstName(name?: string | null): string {
  return name?.trim().split(/\s+/)[0] ?? '';
}
