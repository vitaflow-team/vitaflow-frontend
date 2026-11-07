import type { FormRecord } from '@/_types/clinicalRecords';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AssessmentSection } from './assessmentSection';

const ACTIONS: ClinicalRecordsActions = {
  formRecord: { create: vi.fn() as never },
  template: {
    create: vi.fn() as never,
    update: vi.fn() as never,
    discontinue: vi.fn() as never,
  },
  pdfRoleSegment: 'academia',
};

const RECORDS: FormRecord[] = [
  {
    id: 'record-2',
    recordedAt: '2026-10-05T12:00:00.000Z',
    recordedByUserId: 'u1',
    values: [],
    bmi: null,
  },
  {
    id: 'record-1',
    recordedAt: '2026-09-01T12:00:00.000Z',
    recordedByUserId: 'u1',
    values: [],
    bmi: null,
  },
];

describe('AssessmentSection — pdf-export US-005', () => {
  it('UT-041 renders an Exportar PDF link for the latest (history[0]) assessment', () => {
    const html = renderToStaticMarkup(
      <AssessmentSection
        clientId="client-1"
        templates={[]}
        history={RECORDS}
        actions={ACTIONS}
      />
    );

    expect(html).toContain(
      'href="/api/clinical-records/academia/clients/client-1/form-records/record-2/pdf"'
    );
    expect(html).not.toContain('form-records/record-1/pdf');
    expect(html).toContain('Exportar PDF');
  });

  it('shows no Exportar PDF link when there is no assessment history yet', () => {
    const html = renderToStaticMarkup(
      <AssessmentSection
        clientId="client-1"
        templates={[]}
        history={[]}
        actions={ACTIONS}
      />
    );

    expect(html).not.toContain('Exportar PDF');
  });
});
