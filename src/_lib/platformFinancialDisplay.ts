import { changeVsPrevious } from '@/_lib/financialHealthDisplay';
import type { BackofficeTier } from '@/_types/backofficeStaff';
import type { PlatformBandCounts } from '@/_types/platformBandCounts';
import type { FinancialMonthChanges } from '@/_types/financialMonthChanges';
import type { FinancialMonthTotals } from '@/_types/financialMonthTotals';

/** The change of each figure against the previous month; every one `null` when there is no base. */
export function platformMonthChanges(
  current: FinancialMonthTotals,
  previous: FinancialMonthTotals | null
): FinancialMonthChanges {
  if (!previous) return { expected: null, received: null, stillOwed: null };
  return {
    expected: changeVsPrevious(current.expectedCents, previous.expectedCents),
    received: changeVsPrevious(current.receivedCents, previous.receivedCents),
    stillOwed: changeVsPrevious(
      current.stillOwedCents,
      previous.stillOwedCents
    ),
  };
}

/** Where a delinquent subscriber leads: the account directory, searched by name. */
export function accountDirectoryHref(name: string): string {
  return `/restrict/backoffice/accounts?busca=${encodeURIComponent(name)}`;
}

/** The sentence under the page title: what this tier is looking at. */
export function platformIntro(tier: BackofficeTier | null): string {
  if (tier === 'ADMIN') {
    return 'Previsto, recebido e em atraso das assinaturas da Vita Flow, por tipo de conta. Não inclui o que os profissionais cobram de seus alunos.';
  }
  if (tier === 'EQUIPE') {
    return 'Assinantes inadimplentes da Vita Flow e quantos estão em cada faixa de atraso. O acesso a esta lista fica registrado.';
  }
  return 'Saúde das assinaturas da Vita Flow.';
}

/** "17/11/2026 14:30", in Brasília time, for when the payments were last synced. */
export function formatSyncedAt(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

/** The three aging bands with their delinquent counts, and the total of the three. */
export function bandCountRows(counts: PlatformBandCounts): {
  rows: { label: string; count: number }[];
  total: number;
} {
  const rows = [
    { label: '1–7 dias', count: counts.d1to7 },
    { label: '8–30 dias', count: counts.d8to30 },
    { label: '31+ dias', count: counts.d31Plus },
  ];
  return { rows, total: rows.reduce((sum, row) => sum + row.count, 0) };
}
