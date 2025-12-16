'use client';

import { APP_ROUTES } from '@/_constants/routes';
import { useAlertHook } from '@/_hooks/alert_hook';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  const { openError } = useAlertHook();

  async function submitSignInGoogle() {
    const resp = await signIn('google', {
      redirect: true,
      callbackUrl: APP_ROUTES.PRIVATE.DASHBOARD,
    });

    if (!resp || !resp.ok) {
      openError(
        resp!.error || 'Falha ao autenticar com Google',
        'Atenção!',
        'error'
      );
    }
  }

  return (
    <Image
      src="/google.svg"
      className="bg-white p-2 border-2 hover:cursor-pointer"
      width={50}
      height={50}
      alt="Google"
      onClick={() => submitSignInGoogle()}
    />
  );
}
