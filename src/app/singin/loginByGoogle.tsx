'use client';

import { useAlertHook } from '@/_hooks/alert_hook';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  const { openError } = useAlertHook();

  async function submitSingInGoogle() {
    const resp = await signIn('google', {
      redirect: true,
      callbackUrl: '/restrict',
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
      onClick={() => submitSingInGoogle()}
    />
  );
}
