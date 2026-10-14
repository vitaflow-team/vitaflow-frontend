import type { AccountLookup } from '@/_types/students';
import { apiClient } from './apiClient';

// Best effort: the 409 itself carries no name, so the confirmation step asks
// the lookup for it. When that fails the step still opens, without a name.
export async function accountNameFor(email: string): Promise<string | null> {
  try {
    const lookup = await apiClient<AccountLookup>(
      `/educator/students/account-lookup?email=${encodeURIComponent(email)}`,
      { method: 'GET', cache: 'no-store' }
    );
    return lookup.found ? lookup.name : null;
  } catch {
    return null;
  }
}
