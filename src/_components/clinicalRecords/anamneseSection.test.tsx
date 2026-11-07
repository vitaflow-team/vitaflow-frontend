import type { FormRecord } from '@/_types/clinicalRecords';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AnamneseSection } from './anamneseSection';

// `templates: []` keeps `TemplatesPanel` in its list-only branch, which
// never calls `useRouter()`/`useServerAction()` — no mocking needed.
const ACTIONS: ClinicalRecordsActions = {
  formRecord: { create: vi.fn() as never, update: vi.fn() as never },
  template: {
    create: vi.fn() as never,
    update: vi.fn() as never,
    discontinue: vi.fn() as never,
  },
  pdfRoleSegment: 'professionals',
};

const LATEST: FormRecord = {
  id: 'record-1',
  recordedAt: '2026-10-01T12:00:00.000Z',
  recordedByUserId: 'u1',
  values: [],
  bmi: null,
};

describe('AnamneseSection — pdf-export US-005', () => {
  it('UT-041 renders an Exportar PDF link for the latest filled anamnese', () => {
    const html = renderToStaticMarkup(
      <AnamneseSection
        clientId="client-1"
        templates={[]}
        latest={LATEST}
        actions={ACTIONS}
      />
    );

    expect(html).toContain(
      'href="/api/clinical-records/professionals/clients/client-1/form-records/record-1/pdf"'
    );
    expect(html).toContain('Exportar PDF');
  });

  it('uses the academia PDF role segment when the context is academia-owned', () => {
    const html = renderToStaticMarkup(
      <AnamneseSection
        clientId="client-1"
        templates={[]}
        latest={LATEST}
        actions={{ ...ACTIONS, pdfRoleSegment: 'academia' }}
      />
    );

    expect(html).toContain(
      'href="/api/clinical-records/academia/clients/client-1/form-records/record-1/pdf"'
    );
  });
});
