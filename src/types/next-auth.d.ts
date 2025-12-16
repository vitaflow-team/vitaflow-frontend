import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      avatar?: string | null;
      accessToken?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    accessToken?: string;
  }
}
