export const SETTINGS_TABS = ['perfil', 'plano', 'conta'] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const SETTINGS_TAB_LABELS: Record<SettingsTab, string> = {
  perfil: 'Perfil',
  plano: 'Plano',
  conta: 'Conta',
};

export const SETTINGS_PATH = '/restrict/settings';

/** Aba mostrada quando o endereço não diz qual é (ADR-002). */
const DEFAULT_TAB: SettingsTab = 'perfil';

/**
 * O valor de `?tab=` vem da rede: pode faltar, vir vazio, repetido (o Next
 * entrega um array), com outra caixa ou apontando para uma aba que não existe.
 * Nenhum desses casos é erro para o usuário — todos mostram Perfil.
 */
export function parseSettingsTab(
  value: string | string[] | undefined
): SettingsTab {
  if (typeof value !== 'string') {
    return DEFAULT_TAB;
  }

  return SETTINGS_TABS.includes(value as SettingsTab)
    ? (value as SettingsTab)
    : DEFAULT_TAB;
}

/** Liga a aba ao painel visível: `aria-controls` de um lado, `aria-labelledby` do outro. */
export function settingsTabId(tab: SettingsTab): string {
  return `settings-tab-${tab}`;
}

export function settingsPanelId(tab: SettingsTab): string {
  return `settings-panel-${tab}`;
}

/**
 * Endereço da aba preservando parâmetros extras — o retorno do Checkout precisa
 * carregar `checkout_session_id` junto de `tab=plano` (ADR-002).
 */
export function settingsTabHref(
  tab: SettingsTab,
  extra?: Record<string, string>
): string {
  const params = new URLSearchParams({ tab });

  for (const [key, value] of Object.entries(extra ?? {})) {
    if (key === 'tab') continue;
    params.set(key, value);
  }

  return `${SETTINGS_PATH}?${params.toString()}`;
}
