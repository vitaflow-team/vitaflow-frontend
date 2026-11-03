import { PATIENTS_PATH } from '@/_lib/patientsList';

export const PATIENT_TABS = [
  'overview',
  'anamnese',
  'avaliacao',
  'plano-alimentar',
  'diario-alimentar',
  'cadastro',
  'cobranca',
] as const;

export type PatientTab = (typeof PATIENT_TABS)[number];

export const PATIENT_TAB_LABELS: Record<PatientTab, string> = {
  overview: 'Visão geral',
  anamnese: 'Anamnese',
  avaliacao: 'Avaliação',
  'plano-alimentar': 'Plano alimentar',
  'diario-alimentar': 'Diário alimentar',
  cadastro: 'Cadastro',
  cobranca: 'Cobranças',
};

export function patientTabHref(patientId: string, tab: PatientTab): string {
  const base = `${PATIENTS_PATH}/${patientId}`;
  return tab === 'overview' ? base : `${base}/${tab}`;
}

/** The tab a pathname belongs to; the record root and unknown paths are the overview. */
export function activePatientTab(
  pathname: string,
  patientId: string
): PatientTab {
  const under = (tab: PatientTab) => {
    const path = patientTabHref(patientId, tab);
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  if (under('anamnese')) return 'anamnese';
  if (under('avaliacao')) return 'avaliacao';
  if (under('plano-alimentar')) return 'plano-alimentar';
  if (under('diario-alimentar')) return 'diario-alimentar';
  if (under('cadastro')) return 'cadastro';
  if (under('cobranca')) return 'cobranca';
  return 'overview';
}

export function patientTabId(tab: PatientTab): string {
  return `patient-tab-${tab}`;
}

export function patientPanelId(tab: PatientTab): string {
  return `patient-panel-${tab}`;
}
