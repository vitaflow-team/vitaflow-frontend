import { PATIENTS_PATH } from '@/_lib/patientsList';

export const PATIENT_TABS = [
  'overview',
  'anamnese',
  'avaliacao',
  'plano-alimentar',
] as const;

export type PatientTab = (typeof PATIENT_TABS)[number];

export const PATIENT_TAB_LABELS: Record<PatientTab, string> = {
  overview: 'Visão geral',
  anamnese: 'Anamnese',
  avaliacao: 'Avaliação',
  'plano-alimentar': 'Plano alimentar',
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
  return under('plano-alimentar') ? 'plano-alimentar' : 'overview';
}

export function patientTabId(tab: PatientTab): string {
  return `patient-tab-${tab}`;
}

export function patientPanelId(tab: PatientTab): string {
  return `patient-panel-${tab}`;
}
