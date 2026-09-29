import { describe, expect, it } from 'vitest';
import {
  toFormSettingsProfile,
  toProfileFormValues,
} from './formSettingsProfile';

const ADDRESS = {
  addressLine1: 'Rua das Flores, 10',
  addressLine2: 'Apto 2',
  district: 'Centro',
  city: 'Curitiba',
  region: 'PR',
  postalCode: '80000-000',
};

// A full backend profile response, including fields the form never uses.
const BACKEND_PROFILE = {
  id: 'user-id',
  name: 'Ana Souza',
  email: 'ana@example.test',
  phone: '(41) 99999-0000',
  birthDate: '1990-05-01T00:00:00.000Z',
  avatar: 'https://storage.example.test/avatar.png',
  address: { ...ADDRESS, id: 'address-id', userId: 'user-id' },
  stripeCustomerId: 'cus_123',
  stripeSubscriptionId: 'sub_123',
  productId: 'product-id',
  productType: 'USER',
  subscriptionStatus: 'active',
  clientsCount: 0,
};

describe('platform hardening — narrowed FormSettings props', () => {
  it('UT-011 keeps exactly the fields the form renders or edits', () => {
    const props = toFormSettingsProfile(BACKEND_PROFILE);

    expect(Object.keys(props).sort()).toEqual(
      ['address', 'avatar', 'birthDate', 'email', 'name', 'phone'].sort()
    );
    expect(props).toEqual({
      name: 'Ana Souza',
      email: 'ana@example.test',
      phone: '(41) 99999-0000',
      birthDate: '1990-05-01T00:00:00.000Z',
      avatar: 'https://storage.example.test/avatar.png',
      address: ADDRESS,
    });
  });

  it('UT-011 drops backend-only fields such as the Stripe ids', () => {
    const serialized = JSON.stringify(toFormSettingsProfile(BACKEND_PROFILE));

    expect(serialized).not.toContain('cus_123');
    expect(serialized).not.toContain('sub_123');
    expect(serialized).not.toContain('address-id');
    expect(serialized).not.toContain('user-id');
  });

  it('UT-011 passes a missing address through for the form to default', () => {
    const profile = { ...BACKEND_PROFILE, address: null };

    // The backend may omit the address; the form fills in empty fields.
    expect(
      toFormSettingsProfile(
        profile as unknown as Parameters<typeof toFormSettingsProfile>[0]
      ).address
    ).toBeNull();
  });
});

describe('refactor — profile form initial values', () => {
  // UT-002
  it('maps the profile into form values with an ISO birth date', () => {
    const values = toProfileFormValues(toFormSettingsProfile(BACKEND_PROFILE));

    expect(values).toEqual({
      name: 'Ana Souza',
      email: 'ana@example.test',
      phone: '(41) 99999-0000',
      birthDate: '1990-05-01',
      avatar: undefined,
      address: ADDRESS,
    });
  });

  // UT-005
  it('fills a missing address and empty fields with empty strings', () => {
    const profile = {
      name: 'Ana Souza',
      email: 'ana@example.test',
      address: null,
    } as unknown as Parameters<typeof toProfileFormValues>[0];

    expect(toProfileFormValues(profile)).toEqual({
      name: 'Ana Souza',
      email: 'ana@example.test',
      phone: '',
      birthDate: '',
      avatar: undefined,
      address: {
        addressLine1: '',
        addressLine2: '',
        district: '',
        city: '',
        region: '',
        postalCode: '',
      },
    });
  });
});
