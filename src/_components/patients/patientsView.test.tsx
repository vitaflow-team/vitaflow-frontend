import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { NutritionistPatientList } from '@/_types/patients';

vi.mock('./addPatientPanel', () => ({
  AddPatientPanel: () => <button type="button">Adicionar paciente</button>,
}));
vi.mock('./patientSearch', () => ({
  PatientSearch: () => <div role="search" />,
}));

import { PatientsView } from './patientsView';

const ITEM = {
  id: 'patient-1',
  name: 'Diego Martins',
  email: 'diego@exemplo.com',
  hasAccount: false,
};

function list(
  overrides: Partial<NutritionistPatientList> = {}
): NutritionistPatientList {
  return { items: [], total: 0, ...overrides };
}

describe('PatientsView', () => {
  it('shows the onboarding empty state with no patients and no search', () => {
    const html = renderToStaticMarkup(<PatientsView list={list()} />);
    expect(html).toContain('Você ainda não tem pacientes');
  });

  it('shows the no-results state for a search that matched nothing', () => {
    const html = renderToStaticMarkup(
      <PatientsView list={list()} search="zzz" />
    );
    expect(html).toContain('Nenhum paciente encontrado');
  });

  it('lists the matching patients', () => {
    const html = renderToStaticMarkup(
      <PatientsView list={list({ items: [ITEM], total: 1 })} />
    );
    expect(html).toContain('Diego Martins');
  });
});
