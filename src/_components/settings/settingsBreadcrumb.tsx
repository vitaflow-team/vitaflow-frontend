import { Breadcrumbs } from '@/_components/layout/breadcrumbs';
import { APP_ROUTES } from '@/_constants/routes';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  SETTINGS_TAB_LABELS,
  SETTINGS_PATH,
  type SettingsTab,
} from '@/_lib/settingsTabs';

interface SettingsBreadcrumbProps {
  tab: SettingsTab;
}

/**
 * Configurações carrega o próprio rastro: a barra superior só mostra o nome da
 * página e não sabe em qual aba o usuário está (ADR-001).
 */
export function SettingsBreadcrumb({ tab }: SettingsBreadcrumbProps) {
  return (
    <Breadcrumbs
      items={[
        { label: 'Vita Flow', href: APP_ROUTES.ROUTE_PRIVATE },
        { label: PAGE_TITLES.settings, href: SETTINGS_PATH },
        { label: SETTINGS_TAB_LABELS[tab] },
      ]}
    />
  );
}
