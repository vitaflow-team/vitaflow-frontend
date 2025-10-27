import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const userCredential = {
          password: credentials?.password,
          email: credentials?.email,
        };

        if (
          userCredential.email === 'fcvicari@gmail.com' &&
          userCredential.password === '12345678'
        ) {
          return {
            id: '1',
            name: 'Fulano de Tal',
            email: 'fcvicari@gmail.com',
          };
        }

        return null;
      },
    }),
  ],
  session: {
    maxAge: 60 * 60, // 1 hora
    strategy: 'jwt',
  },
  pages: {
    signIn: '/singin',
    signOut: '/',
    error: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      const jwtReturn = {
        ...token,
        ...user,
      };

      return jwtReturn;
    },

    async session({ session, token }) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      session.user = token as any;

      return session;
    },
  },
};
