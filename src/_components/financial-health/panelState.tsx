import { noticeFor } from '@/_lib/financialPanelNotice';
import { panelStateOf, showsFigures } from '@/_lib/financialPanelState';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { ReactNode } from 'react';
import { PanelNotice } from './panelNotice';

interface PanelStateProps {
  summary: Pick<FinancialHealthSummary, 'billingState' | 'hasHistory'>;
  /** `null` when the plan could not be checked. */
  canBill: boolean | null;
  copy: FinancialPanelCopy;
  /** The figures: shown whenever the state has real data behind it. */
  children: ReactNode;
}

/**
 * Tells the reader which of the distinct states the panel is in, and keeps
 * zeros off the screen when there is nothing behind them (PRD rules 35 and 36).
 */
export function PanelState({
  summary,
  canBill,
  copy,
  children,
}: PanelStateProps) {
  const state = panelStateOf(summary, canBill);
  const notice = noticeFor(state, copy, canBill);

  return (
    <>
      {notice && <PanelNotice {...notice} />}
      {showsFigures(state) && children}
    </>
  );
}
