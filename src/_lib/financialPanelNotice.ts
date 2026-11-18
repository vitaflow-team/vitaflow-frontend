import { settingsTabHref } from '@/_lib/settingsTabs';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { FinancialPanelNotice } from '@/_types/financialPanelNotice';
import type { FinancialPanelState } from '@/_types/financialPanelState';

const HISTORY_NOTE = 'Os valores abaixo vêm das cobranças já emitidas.';

function connectAction(): Pick<
  FinancialPanelNotice,
  'actionHref' | 'actionLabel'
> {
  return {
    actionHref: settingsTabHref('cobranca'),
    actionLabel: 'Conectar cobrança',
  };
}

function plansAction(): Pick<
  FinancialPanelNotice,
  'actionHref' | 'actionLabel'
> {
  return { actionHref: settingsTabHref('plano'), actionLabel: 'Ver planos' };
}

/**
 * The notice a state calls for. Only a refused payment key is an `alert`: it is
 * the one state where the figures may be out of date and the reader can act.
 */
export function noticeFor(
  state: FinancialPanelState,
  copy: FinancialPanelCopy,
  canBill: boolean | null
): FinancialPanelNotice | null {
  switch (state) {
    case 'EMPTY':
      return canBill === false
        ? { message: copy.lockedHint, role: 'status', ...plansAction() }
        : { message: copy.connectHint, role: 'status', ...connectAction() };
    case 'RECONNECT':
      return {
        message:
          'A chave da conta Asaas foi recusada. Reconecte para atualizar: os valores abaixo são os últimos conhecidos.',
        role: 'alert',
        actionHref: settingsTabHref('cobranca'),
        actionLabel: 'Reconectar',
      };
    case 'HISTORY_ONLY':
      return {
        message: `A conta Asaas não está conectada. ${HISTORY_NOTE}`,
        role: 'status',
        ...connectAction(),
      };
    case 'PREMIUM_LOST':
      return {
        message: `${copy.lockedHint} ${HISTORY_NOTE}`,
        role: 'status',
        ...plansAction(),
      };
    case 'ZERO':
      return { message: copy.zeroHint, role: 'status' };
    case 'READY':
      return null;
  }
}
