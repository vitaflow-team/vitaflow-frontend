'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface UserSessionProviderProps {
  children: ReactNode;
}

export function UserSessionProvider({ children }: UserSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
