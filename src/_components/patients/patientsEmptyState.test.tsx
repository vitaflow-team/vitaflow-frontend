import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./addPatientPanel', () => ({
  AddPatientPanel: ({ triggerLabel }: { triggerLabel?: string }) => (
    <button type="button">{triggerLabel}</button>
  ),
}));

import { PatientsEmptyState } from './patientsEmptyState';

describe('PatientsEmptyState', () => {
  it('explains the area and offers the one next step', () => {
    const html = renderToStaticMarkup(<PatientsEmptyState />);
    expect(html).toContain('Você ainda não tem pacientes');
    expect(html).toContain('Adicionar paciente');
  });
});
