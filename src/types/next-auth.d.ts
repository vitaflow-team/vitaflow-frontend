import type { GoogleRefusalCode } from '@/_types/googleRefusalCode';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    productId?: string | null;
    productGroupId?: string | null;
    productType?: string | null;
    role?: string | null;
    /**
     * Set only on the marker a refused Google attempt resolves to, between
     * the provider's `profile()` and `callbacks.signIn`. Never in a session.
     */
    refusal?: GoogleRefusalCode;
    /** Whether the refused attempt was a link from Configurações. */
    linking?: boolean;
  }

  interface Session {
    user: {
      id: string;
      avatar?: string | null;
      productId?: string | null;
      productGroupId?: string | null;
      productType?: string | null;
      role?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    productId?: string | null;
    productGroupId?: string | null;
    productType?: string | null;
    role?: string | null;
  }
}
