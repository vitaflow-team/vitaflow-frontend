import { describe, expect, it } from 'vitest';
import { noticeFor } from './financialPanelNotice';
import { panelCopy } from './financialPanelCopy';

const PROFESSIONAL = panelCopy('PHYSICAL_EDUCATOR');
const GYM = panelCopy('ACADEMIA');

describe('financial panel notices', () => {
  it('invites a professional who can bill to connect the account', () => {
    const notice = noticeFor('EMPTY', PROFESSIONAL, true);

    expect(notice?.message).toBe(PROFESSIONAL.connectHint);
    expect(notice?.actionHref).toBe('/restrict/settings?tab=cobranca');
    expect(notice?.role).toBe('status');
  });

  it('asks a professional who cannot bill for Premium and points to the plans', () => {
    const notice = noticeFor('EMPTY', PROFESSIONAL, false);

    expect(notice?.message).toContain('Premium');
    expect(notice?.actionHref).toBe('/restrict/settings?tab=plano');
  });

  it('asks a gym without a paid subscription for a subscription, never for Premium', () => {
    const notice = noticeFor('EMPTY', GYM, false);

    expect(notice?.message).toContain('assinatura ativa');
    expect(notice?.message).not.toContain('Premium');
  });

  it('announces only a refused key as an alert', () => {
    expect(noticeFor('RECONNECT', PROFESSIONAL, null)?.role).toBe('alert');
    for (const state of [
      'EMPTY',
      'HISTORY_ONLY',
      'PREMIUM_LOST',
      'ZERO',
    ] as const) {
      expect(noticeFor(state, PROFESSIONAL, null)?.role).toBe('status');
    }
  });

  it('notes that history-only figures come from invoices already issued', () => {
    expect(noticeFor('HISTORY_ONLY', GYM, null)?.message).toContain(
      'cobranças já emitidas'
    );
    expect(noticeFor('PREMIUM_LOST', PROFESSIONAL, false)?.message).toContain(
      'cobranças já emitidas'
    );
  });

  it('hints how to fill an empty connected panel and says nothing when ready', () => {
    expect(noticeFor('ZERO', GYM, null)?.message).toBe(GYM.zeroHint);
    expect(noticeFor('READY', GYM, null)).toBeNull();
  });
});
