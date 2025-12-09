import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    avatar: string | undefined;
    accessToken: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    avatar: string | undefined;
    accessToken: string;
  }
}
