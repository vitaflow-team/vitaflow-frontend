import type { ProfessionalProfile } from '@/_types/professionalDiscovery';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/professionalDiscovery/updateMyProfile', () => ({
  updateMyProfile: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

import { ProfileEditForm } from './profileEditForm';

function profile(
  overrides: Partial<ProfessionalProfile> = {}
): ProfessionalProfile {
  return {
    id: 'prof-1',
    name: 'Dra. Ana',
    type: 'NUTRITIONIST',
    specialty: null,
    priceFrom: null,
    attendsOnline: false,
    bio: null,
    ...overrides,
  };
}

describe('ProfileEditForm', () => {
  it('labels the registration field CRN for a nutritionist (US-017.AC-1)', () => {
    const html = renderToStaticMarkup(<ProfileEditForm profile={profile()} />);
    expect(html).toContain('CRN');
    expect(html).not.toContain('CREF');
  });

  it('labels the registration field CREF for a physical educator (US-017.AC-2)', () => {
    const html = renderToStaticMarkup(
      <ProfileEditForm profile={profile({ type: 'PHYSICAL_EDUCATOR' })} />
    );
    expect(html).toContain('CREF');
  });

  it('pre-fills the registration number already on record', () => {
    const html = renderToStaticMarkup(
      <ProfileEditForm profile={profile({ registrationNumber: '12345/P' })} />
    );
    expect(html).toContain('12345/P');
  });
});
