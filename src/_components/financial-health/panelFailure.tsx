import type { LoadFailure } from '@/_types/loadFailure';
import { PanelNotice } from './panelNotice';

interface PanelFailureProps {
  failure: LoadFailure;
  /** What could not be shown, with its article: "o painel financeiro". */
  what: string;
  retryHref: string;
}

function messageFor(failure: LoadFailure, what: string): string {
  if (failure === 'forbidden') return 'Você não tem acesso a esta área.';
  if (failure === 'not-found') return `Não encontramos ${what}.`;
  return `Não foi possível carregar ${what}. Tente novamente em alguns instantes.`;
}

/** A read that failed: said in words, with a retry only when trying again can help. */
export function PanelFailure({ failure, what, retryHref }: PanelFailureProps) {
  const canRetry = failure === 'failed';

  return (
    <PanelNotice
      role="alert"
      message={messageFor(failure, what)}
      actionHref={canRetry ? retryHref : undefined}
      actionLabel={canRetry ? 'Tentar novamente' : undefined}
    />
  );
}
