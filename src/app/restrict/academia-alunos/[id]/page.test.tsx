import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gateMock, loadInvoicesMock, loadTemplatesMock, loadHistoryMock } =
  vi.hoisted(() => ({
    gateMock: vi.fn(),
    loadInvoicesMock: vi.fn(),
    loadTemplatesMock: vi.fn(),
    loadHistoryMock: vi.fn(),
  }));

vi.mock('@/_lib/academiaAuthorization', () => ({
  redirectUnlessAcademiaOwner: gateMock,
}));
vi.mock('@/_lib/billingData', () => ({
  loadStudentInvoices: loadInvoicesMock,
}));
vi.mock('@/_lib/academiaClinicalRecordsData', () => ({
  isLoadFailure: (result: unknown) => typeof result === 'string',
  loadAcademiaTemplatesForClient: loadTemplatesMock,
  loadAcademiaFormRecordHistory: loadHistoryMock,
}));
vi.mock('@/_lib/academiaClinicalRecordsActions', () => ({
  ACADEMIA_CLINICAL_RECORDS_ACTIONS: {},
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('@/_components/clinicalRecords/assessmentSection', () => ({
  AssessmentSection: ({ clientId }: { clientId: string }) => (
    <p>avaliação:{clientId}</p>
  ),
}));
vi.mock('@/_components/academia-alunos/gymStudentBilling', () => ({
  GymStudentBilling: ({
    clientId,
    invoices,
  }: {
    clientId: string;
    invoices: unknown;
  }) => (
    <p>
      cobrança:{clientId}:{typeof invoices === 'string' ? invoices : 'ok'}
    </p>
  ),
}));

import AcademiaAlunoPage from './page';

async function renderPage(page?: string | string[]) {
  const element = await AcademiaAlunoPage({
    params: Promise.resolve({ id: 's1' }),
    searchParams: Promise.resolve(page === undefined ? {} : { page }),
  });
  return renderToStaticMarkup(<>{element}</>);
}

describe('gym student page — financial-health US-016', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    gateMock.mockResolvedValue(undefined);
    loadTemplatesMock.mockResolvedValue([]);
    loadHistoryMock.mockResolvedValue([]);
    loadInvoicesMock.mockResolvedValue({ items: [] });
  });

  it('shows the assessment and the billing section of the student', async () => {
    const html = await renderPage();

    expect(html).toContain('avaliação:s1');
    expect(html).toContain('cobrança:s1:ok');
    expect(loadInvoicesMock).toHaveBeenCalledWith('s1', 1);
  });

  it('reads the requested page of fees, falling back to the first for anything invalid', async () => {
    await renderPage('3');
    expect(loadInvoicesMock).toHaveBeenLastCalledWith('s1', 3);

    await renderPage('abc');
    expect(loadInvoicesMock).toHaveBeenLastCalledWith('s1', 1);
  });

  it('reads nothing when the owner gate redirects', async () => {
    gateMock.mockRejectedValue(new Error('NEXT_REDIRECT'));

    await expect(renderPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(loadInvoicesMock).not.toHaveBeenCalled();
    expect(loadTemplatesMock).not.toHaveBeenCalled();
  });

  it('keeps the billing section when the assessments cannot be loaded', async () => {
    loadTemplatesMock.mockResolvedValue('failed');

    const html = await renderPage();

    expect(html).toContain('Não foi possível carregar as avaliações');
    expect(html).toContain('cobrança:s1:ok');
  });

  it('hands a failed fee load to the billing section, which says so', async () => {
    loadInvoicesMock.mockResolvedValue('failed');

    const html = await renderPage();

    expect(html).toContain('cobrança:s1:failed');
    expect(html).toContain('avaliação:s1');
  });
});
