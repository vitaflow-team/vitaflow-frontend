import { describe, expect, it } from 'vitest';
import { activePatientTab, patientTabHref } from './patientsTabs';

const PATIENT_ID = 'patient-1';

describe('patientTabHref', () => {
  it('the overview tab is the record root', () => {
    expect(patientTabHref(PATIENT_ID, 'overview')).toBe(
      `/restrict/patients/${PATIENT_ID}`
    );
  });

  it('every other tab appends its own segment', () => {
    expect(patientTabHref(PATIENT_ID, 'anamnese')).toBe(
      `/restrict/patients/${PATIENT_ID}/anamnese`
    );
    expect(patientTabHref(PATIENT_ID, 'avaliacao')).toBe(
      `/restrict/patients/${PATIENT_ID}/avaliacao`
    );
    expect(patientTabHref(PATIENT_ID, 'plano-alimentar')).toBe(
      `/restrict/patients/${PATIENT_ID}/plano-alimentar`
    );
    expect(patientTabHref(PATIENT_ID, 'diario-alimentar')).toBe(
      `/restrict/patients/${PATIENT_ID}/diario-alimentar`
    );
  });
});

describe('activePatientTab', () => {
  it('the record root and unknown paths are the overview', () => {
    expect(
      activePatientTab(`/restrict/patients/${PATIENT_ID}`, PATIENT_ID)
    ).toBe('overview');
    expect(activePatientTab('/restrict/patients/other', PATIENT_ID)).toBe(
      'overview'
    );
  });

  it('a tab path, or anything nested under it, resolves to that tab', () => {
    expect(
      activePatientTab(`/restrict/patients/${PATIENT_ID}/anamnese`, PATIENT_ID)
    ).toBe('anamnese');
    expect(
      activePatientTab(
        `/restrict/patients/${PATIENT_ID}/avaliacao/extra`,
        PATIENT_ID
      )
    ).toBe('avaliacao');
    expect(
      activePatientTab(
        `/restrict/patients/${PATIENT_ID}/plano-alimentar`,
        PATIENT_ID
      )
    ).toBe('plano-alimentar');
    expect(
      activePatientTab(
        `/restrict/patients/${PATIENT_ID}/diario-alimentar`,
        PATIENT_ID
      )
    ).toBe('diario-alimentar');
  });
});
