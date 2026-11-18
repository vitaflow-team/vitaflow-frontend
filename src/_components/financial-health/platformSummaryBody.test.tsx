import type { PlatformSummary } from '@/_types/platformSummary';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformSummaryBody } from './platformSummaryBody';

const ZERO = { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 };
const NO_OVERDUE = {
  totalCents: 0,
  delinquentCount: 0,
  bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
};
const BY_TYPE = {
  USER: { expectedCents: 14990, receivedCents: 14990, stillOwedCents: 0 },
  NUTRITIONIST: { expectedCents: 9990, receivedCents: 0, stillOwedCents: 9990 },
  PHYSICAL_EDUCATOR: ZERO,
  ACADEMIA: ZERO,
};
const OVERDUE = {
  totalCents: 9990,
  delinquentCount: 1,
  bands: { d1to7Cents: 9990, d8to30Cents: 0, d31PlusCents: 0 },
  byAccountType: {
    USER: NO_OVERDUE,
    NUTRITIONIST: {
      totalCents: 9990,
      delinquentCount: 1,
      bands: { d1to7Cents: 9990, d8to30Cents: 0, d31PlusCents: 0 },
    },
    PHYSICAL_EDUCATOR: NO_OVERDUE,
    ACADEMIA: NO_OVERDUE,
  },
};

const SUMMARY: PlatformSummary = {
  month: '2026-11',
  available: true,
  syncedAt: '2026-11-17T17:30:00.000Z',
  totals: { expectedCents: 24980, receivedCents: 14990, stillOwedCents: 9990 },
  byAccountType: BY_TYPE,
  previous: {
    month: '2026-10',
    totals: { expectedCents: 20000, receivedCents: 20000, stillOwedCents: 0 },
    byAccountType: BY_TYPE,
  },
  overdue: OVERDUE,
};

describe('PlatformSummaryBody — financial-health US-021, US-022, US-025', () => {
  it('shows expected, received and still owed with the change, the account types and the overdue bands', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody summary={SUMMARY} />
    );

    expect(html).toContain('Resumo de Novembro de 2026');
    expect(html).toMatch(/R\$\s249,80/);
    expect(html).toContain('+25%');
    expect(html).toContain('Por tipo de conta');
    expect(html).toContain('1–7 dias');
  });

  it('UT-120 shows "Sem comparação", never a percentage, when the previous month is unavailable', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody summary={{ ...SUMMARY, previous: null }} />
    );

    expect(html).toContain('Sem comparação');
    expect(html).not.toContain('%');
  });

  it('UT-119 says the month is "indisponível" instead of showing zeros, and still shows today overdue', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody
        summary={{
          ...SUMMARY,
          month: '2025-12',
          available: false,
          totals: null,
          byAccountType: null,
          previous: null,
        }}
      />
    );

    expect(html).toContain('Dezembro de 2025 está indisponível');
    expect(html).not.toContain('Previsto');
    expect(html).not.toContain('Por tipo de conta');
    expect(html).toContain('Em atraso hoje');
    expect(html).toContain('1–7 dias');
  });

  it('says the sync time in Brasília time', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody summary={SUMMARY} />
    );

    expect(html).toContain('Pagamentos sincronizados em 17/11/2026');
    expect(html).toContain('14:30');
  });

  it('leaves the sync line out when nothing was synced yet', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody summary={{ ...SUMMARY, syncedAt: null }} />
    );

    expect(html).not.toContain('sincronizados');
  });

  it('says nothing is overdue in words when the overdue total is zero (US-022.EC-4)', () => {
    const html = renderToStaticMarkup(
      <PlatformSummaryBody
        summary={{
          ...SUMMARY,
          overdue: { ...NO_OVERDUE, byAccountType: OVERDUE.byAccountType },
        }}
      />
    );

    expect(html).toContain('Nenhuma assinatura em atraso');
  });
});
