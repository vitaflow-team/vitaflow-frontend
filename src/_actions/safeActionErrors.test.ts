import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock, stripeFailure } =
  vi.hoisted(() => ({
    apiClientMock: vi.fn(),
    authMock: vi.fn(),
    fetchPlanClaimsMock: vi.fn(),
    stripeFailure: vi.fn(),
  }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/_lib/env', () => ({
  env: {
    BACKEND_URL: 'https://backend.example.test',
    APP_SECRET_KEY: 'application-secret',
    STRIPE_API_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test',
  },
}));
vi.mock('@/auth', () => ({
  auth: authMock,
  unstable_update: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));
vi.mock('@/_lib/stripe', () => ({
  stripe: {
    subscriptions: { retrieve: stripeFailure, update: stripeFailure },
    checkout: {
      sessions: { create: stripeFailure, retrieve: stripeFailure },
    },
  },
}));

import { AppError } from '@/_lib/AppError';
import { actionDeleteClientsByUser } from './clients/deleteClientsByUser';
import { actionGetClientById } from './clients/getClientById';
import { actionGetClientsByUser } from './clients/getClientsByUser';
import { actionPostClientByUser } from './clients/postClientsByUser';
import { actionGetProductsPlans } from './products/getProdductsPlans';
import { createMeasurementRecord } from './progress/createMeasurementRecord';
import { deleteMeasurementRecord } from './progress/deleteMeasurementRecord';
import { updateMeasurementRecord } from './progress/updateMeasurementRecord';
import { actionCancelSubscription } from './stripe/cancelSubscription';
import { actionChangeSubscriptionPlan } from './stripe/changeSubscriptionPlan';
import { actionCreateCheckoutSession } from './stripe/createCheckoutSession';
import { actionReactivateSubscription } from './stripe/reactivateSubscription';
import { actionChangeProfile } from './users/postChangeProfile';
import { actionNewPassword } from './users/postNewPassword';
import { actionResetPassword } from './users/postResetPassword';
import { actionSignUp } from './users/postSignup';
import { actionUpdateSubscription } from './users/postUpdateSubscription';

const RAW = 'raw-internal: sk_live_leak relation users_email_key';
const ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5d';
const PASSWORD = 'Senha1234';
const CLIENT = {
  name: 'Ana',
  phone: '(11) 91234-5678',
  email: 'ana@example.com',
  birthDate: '1990-01-01',
};
const PROFILE = {
  ...CLIENT,
  address: {
    addressLine1: 'Rua A',
    addressLine2: '',
    district: 'Centro',
    postalCode: '01001-000',
    region: 'SP',
    city: 'São Paulo',
  },
};

type ActionCall = () => Promise<[unknown, { message: string } | null]>;

const ACTIONS: [string, ActionCall][] = [
  ['deleteClientsByUser', () => actionDeleteClientsByUser({ id: ID })],
  ['getClientById', () => actionGetClientById({ id: ID })],
  ['getClientsByUser', () => actionGetClientsByUser()],
  ['postClientsByUser', () => actionPostClientByUser(CLIENT)],
  ['getProdductsPlans', () => actionGetProductsPlans()],
  [
    'createMeasurementRecord',
    () => createMeasurementRecord({ weightKg: 60, heightCm: 168 }),
  ],
  ['deleteMeasurementRecord', () => deleteMeasurementRecord({ id: ID })],
  [
    'updateMeasurementRecord',
    () => updateMeasurementRecord({ id: ID, weightKg: 60, heightCm: 168 }),
  ],
  ['cancelSubscription', () => actionCancelSubscription()],
  [
    'changeSubscriptionPlan',
    () => actionChangeSubscriptionPlan({ productId: ID }),
  ],
  [
    'createCheckoutSession',
    () => actionCreateCheckoutSession({ productId: ID }),
  ],
  ['reactivateSubscription', () => actionReactivateSubscription()],
  ['postChangeProfile', () => actionChangeProfile(PROFILE)],
  [
    'postNewPassword',
    () =>
      actionNewPassword({
        password: PASSWORD,
        checkPassword: PASSWORD,
        token: 't',
      }),
  ],
  ['postResetPassword', () => actionResetPassword({ email: 'a@example.com' })],
  [
    'postSignup',
    () =>
      actionSignUp({
        name: 'Ana',
        email: 'a@example.com',
        password: PASSWORD,
        checkPassword: PASSWORD,
        termsAccepted: true,
        healthDataConsent: true,
      }),
  ],
  [
    'postUpdateSubscription',
    () => actionUpdateSubscription({ sessionId: 'cs_test' }),
  ],
];

const FAILURES: [string, () => unknown][] = [
  ['an unmapped backend AppError', () => new AppError(RAW, 500)],
  ['a plain Error', () => new Error(RAW)],
  [
    'a Stripe-shaped error',
    () => Object.assign(new Error(RAW), { code: 'x', statusCode: 400 }),
  ],
];

describe('auth input hardening — no Server Action relays a raw error', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({
      user: { id: 'user-id', email: 'a@example.com' },
    });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });
  });

  it('covers all 17 audited actions', () => {
    expect(ACTIONS).toHaveLength(17);
  });

  describe.each(FAILURES)('UT-010 given %s', (_, makeError) => {
    it.each(ACTIONS)('%s returns a safe message', async (_, run) => {
      apiClientMock.mockReset().mockRejectedValue(makeError());
      stripeFailure.mockReset().mockRejectedValue(makeError());

      const [, error] = await run();

      expect(error).not.toBeNull();
      expect(error?.message).not.toContain(RAW);
    });
  });
});
