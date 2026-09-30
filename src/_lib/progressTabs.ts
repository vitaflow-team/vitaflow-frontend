export const PROGRESS_TABS = ['medidas', 'fotos'] as const;

export type ProgressTab = (typeof PROGRESS_TABS)[number];

export const PROGRESS_TAB_LABELS: Record<ProgressTab, string> = {
  medidas: 'Medidas',
  fotos: 'Fotos',
};

export const PROGRESS_PATH = '/restrict/progress';

const DEFAULT_TAB: ProgressTab = 'medidas';

// The `?tab=` value comes from the network: it can be missing, empty,
// repeated (Next hands back an array), differently cased, or pointing at a
// tab that doesn't exist. None of that is a user-facing error — all of it
// falls back to Medidas.
export function parseProgressTab(
  value: string | string[] | undefined
): ProgressTab {
  if (typeof value !== 'string') {
    return DEFAULT_TAB;
  }

  return PROGRESS_TABS.includes(value as ProgressTab)
    ? (value as ProgressTab)
    : DEFAULT_TAB;
}

export function progressTabId(tab: ProgressTab): string {
  return `progress-tab-${tab}`;
}

export function progressPanelId(tab: ProgressTab): string {
  return `progress-panel-${tab}`;
}

// Preserves extra params (e.g. `semanas`) across a tab switch, mirroring
// settingsTabHref's pattern.
export function progressTabHref(
  tab: ProgressTab,
  extra?: Record<string, string>
): string {
  const params = new URLSearchParams({ tab });

  for (const [key, value] of Object.entries(extra ?? {})) {
    if (key === 'tab') continue;
    params.set(key, value);
  }

  return `${PROGRESS_PATH}?${params.toString()}`;
}
