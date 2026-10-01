export const PROFESSIONAL_DISCOVERY_TABS = [
  'buscar',
  'solicitacoes',
  'recebidas',
  'perfil',
] as const;

export type ProfessionalDiscoveryTab =
  (typeof PROFESSIONAL_DISCOVERY_TABS)[number];

export const PROFESSIONAL_DISCOVERY_TAB_LABELS: Record<
  ProfessionalDiscoveryTab,
  string
> = {
  buscar: 'Buscar',
  solicitacoes: 'Minhas solicitações',
  recebidas: 'Solicitações recebidas',
  perfil: 'Meu perfil',
};

export const PROFESSIONAL_DISCOVERY_PATH = '/restrict/professionals';

const DEFAULT_TAB: ProfessionalDiscoveryTab = 'buscar';

// Hidden, not just inaccessible, for a plain USER account — the backend
// guards these same two surfaces with ProfessionalGuard (US-007–US-010);
// this is the UI's own reflection of that rule, not a separate decision.
const PROFESSIONAL_ONLY_TABS: ProfessionalDiscoveryTab[] = [
  'recebidas',
  'perfil',
];

export function availableTabs(
  isProfessional: boolean
): ProfessionalDiscoveryTab[] {
  return PROFESSIONAL_DISCOVERY_TABS.filter(
    tab => isProfessional || !PROFESSIONAL_ONLY_TABS.includes(tab)
  );
}

// An unknown, missing or professional-only (for a non-professional) value
// falls back to Buscar — never a user-facing error.
export function parseProfessionalDiscoveryTab(
  value: string | string[] | undefined,
  isProfessional: boolean
): ProfessionalDiscoveryTab {
  if (typeof value !== 'string') return DEFAULT_TAB;

  const allowed = availableTabs(isProfessional);
  return allowed.includes(value as ProfessionalDiscoveryTab)
    ? (value as ProfessionalDiscoveryTab)
    : DEFAULT_TAB;
}

export function professionalDiscoveryTabId(
  tab: ProfessionalDiscoveryTab
): string {
  return `professional-discovery-tab-${tab}`;
}

export function professionalDiscoveryPanelId(
  tab: ProfessionalDiscoveryTab
): string {
  return `professional-discovery-panel-${tab}`;
}

export function professionalDiscoveryTabHref(
  tab: ProfessionalDiscoveryTab
): string {
  const params = new URLSearchParams({ tab });
  return `${PROFESSIONAL_DISCOVERY_PATH}?${params.toString()}`;
}
