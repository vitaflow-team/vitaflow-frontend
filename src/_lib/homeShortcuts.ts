import { APP_ROUTES, type AppRoute } from '@/_constants/routes';

const PEOPLE_URLS = ['/restrict/clients', '/restrict/students'];

/**
 * The professional's way to the people they follow: "Pessoas" for a
 * nutritionist, "Alunos" for a physical educator. It is read from the same
 * route table as the menu, so the Início can never point somewhere the menu
 * (and the access check) would refuse.
 */
export function peopleShortcut(productType?: string | null): AppRoute | null {
  return (
    APP_ROUTES.PRIVATE.find(
      route =>
        PEOPLE_URLS.includes(route.URL) &&
        route.PRODUCT_TYPE.includes(productType ?? '')
    ) ?? null
  );
}
