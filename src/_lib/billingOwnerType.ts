// Quem cobra é o profissional independente ou o dono da academia (ADR-008).
const BILLING_OWNER_TYPES = new Set([
  'NUTRITIONIST',
  'PHYSICAL_EDUCATOR',
  'ACADEMIA',
]);

export function isBillingOwnerType(productType?: string | null): boolean {
  return BILLING_OWNER_TYPES.has(productType ?? '');
}
