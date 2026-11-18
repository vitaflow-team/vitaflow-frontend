import { panelHref } from '@/_lib/financialHealthParams';
import type { FinancialPanelQuery } from '@/_types/financialPanelQuery';
import type { PlatformDelinquentsFailure as PlatformDelinquentsFailureKind } from '@/_types/platformDelinquentsFailure';
import { PanelFailure } from './panelFailure';
import { PanelNotice } from './panelNotice';

interface PlatformDelinquentsFailureProps {
  failure: PlatformDelinquentsFailureKind;
  path: string;
  query: FinancialPanelQuery;
}

/**
 * Why the list is not there. When the access could not be recorded the list
 * stays hidden on purpose: access without a record is not allowed (ADR-010).
 */
export function PlatformDelinquentsFailure({
  failure,
  path,
  query,
}: PlatformDelinquentsFailureProps) {
  const retryHref = panelHref(path, query);

  if (failure === 'access-log-failed') {
    return (
      <PanelNotice
        role="alert"
        message="Não foi possível registrar o seu acesso à lista de inadimplentes, por isso ela não é exibida. Tente novamente em alguns instantes."
        actionHref={retryHref}
        actionLabel="Tentar novamente"
      />
    );
  }

  return (
    <PanelFailure
      failure={failure}
      what="a lista de inadimplentes"
      retryHref={retryHref}
    />
  );
}
