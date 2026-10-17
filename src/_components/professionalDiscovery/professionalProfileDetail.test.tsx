import type { ProfessionalProfile } from '@/_types/professionalDiscovery';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProfessionalProfileDetail } from './professionalProfileDetail';

function profile(
  overrides: Partial<ProfessionalProfile> = {}
): ProfessionalProfile {
  return {
    id: 'prof-1',
    name: 'Dra. Ana',
    type: 'NUTRITIONIST',
    specialty: 'Nutrição esportiva',
    priceFrom: 150,
    attendsOnline: true,
    bio: null,
    ...overrides,
  };
}

describe('ProfessionalProfileDetail', () => {
  it('shows the registration number with its label when set (US-021)', () => {
    const html = renderToStaticMarkup(
      <ProfessionalProfileDetail
        profile={profile({
          registrationNumber: '12345/P',
          registrationLabel: 'CRN',
        })}
      />
    );
    expect(html).toContain('CRN: 12345/P');
  });

  it('omits the registration line entirely when unset (US-017.EC-1)', () => {
    const html = renderToStaticMarkup(
      <ProfessionalProfileDetail profile={profile()} />
    );
    expect(html).not.toContain('CRN');
    expect(html).not.toContain('CREF');
  });
});
