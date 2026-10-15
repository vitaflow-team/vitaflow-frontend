export const RECEPTIONIST_ACCOUNT_TYPE = 'RECEPTIONIST';

interface AccountTypeSource {
  productType?: string | null;
  role?: string | null;
}

export function effectiveAccountType(
  user?: AccountTypeSource | null
): string | null | undefined {
  if (user?.role === RECEPTIONIST_ACCOUNT_TYPE)
    return RECEPTIONIST_ACCOUNT_TYPE;
  return user?.productType;
}
