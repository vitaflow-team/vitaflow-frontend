import type { FormSettingsProfile } from '@/_types/formSettingsProfile';

/** The `GET /profile` fields the Settings page reads. */
export type SettingsProfile = FormSettingsProfile & {
  productId?: string | null;
  /** Current product type and group: the server's truth for access and sections. */
  productType?: string | null;
  productGroupId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionCancelAt?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
  /** Plan expiry and renewal, already derived by the backend (ADR-004). */
  expiresAt?: string | null;
  autoRenew?: boolean | null;
  /** `0` for non-professionals; absent when the backend does not send it (ADR-008). */
  clientsCount?: number | null;
};
