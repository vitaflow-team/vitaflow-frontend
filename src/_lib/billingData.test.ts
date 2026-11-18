import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SettingsProfile } from '@/_types/settingsProfile';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({ unstable_rethrow: vi.fn() }));

import { loadBillingAccountForTab } from './billingData';

const ACCOUNT = {
  premium: true,
  connected: false,
  status: 'NOT_CONNECTED',
  accountName: null,
  openInvoiceCount: 0,
};

function profileOf(productType: string | null): SettingsProfile {
  return { productType } as SettingsProfile;
}

describe('loadBillingAccountForTab', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    apiClientMock.mockResolvedValue(ACCOUNT);
  });

  it.each(['NUTRITIONIST', 'PHYSICAL_EDUCATOR', 'ACADEMIA'])(
    'loads the billing account of a %s on the cobrança tab',
    async productType => {
      const result = await loadBillingAccountForTab(
        'cobranca',
        profileOf(productType)
      );

      expect(result).toEqual(ACCOUNT);
      expect(apiClientMock).toHaveBeenCalledWith('/billing/account', {
        method: 'GET',
        cache: 'no-store',
      });
    }
  );

  it.each(['USER', null])(
    'does not load it for %s, who cannot bill',
    async productType => {
      expect(
        await loadBillingAccountForTab('cobranca', profileOf(productType))
      ).toBeNull();
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it('does not load it without a profile', async () => {
    expect(await loadBillingAccountForTab('cobranca', null)).toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('does not load it on any other tab', async () => {
    expect(
      await loadBillingAccountForTab('perfil', profileOf('ACADEMIA'))
    ).toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
