import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { NutritionistPatientListItem } from '@/_types/patients';
import { PatientRow } from './patientRow';

function patient(
  overrides: Partial<NutritionistPatientListItem> = {}
): NutritionistPatientListItem {
  return {
    id: 'patient-1',
    name: 'Diego Martins',
    email: 'diego@exemplo.com',
    hasAccount: false,
    ...overrides,
  };
}

describe('PatientRow', () => {
  it('shows the name, e-mail and a link to the record', () => {
    const html = renderToStaticMarkup(<PatientRow patient={patient()} />);
    expect(html).toContain('Diego Martins');
    expect(html).toContain('diego@exemplo.com');
    expect(html).toContain('href="/restrict/patients/patient-1"');
  });

  it('shows the account chip for a linked patient', () => {
    const html = renderToStaticMarkup(
      <PatientRow patient={patient({ hasAccount: true })} />
    );
    expect(html).toContain('Com conta');
  });

  it('renders a name with markup as visible text and creates no element', () => {
    const hostile = patient({ name: '<img src=x onerror=alert(1)>' });
    const html = renderToStaticMarkup(<PatientRow patient={hostile} />);
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img');
  });
});
