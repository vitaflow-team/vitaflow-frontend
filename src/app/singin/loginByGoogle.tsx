'use client';

import { useAlertHook } from '@/_hooks/alert_hook';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginByGoogle() {
  const { openError } = useAlertHook();

  async function submitSingInGoogle() {
    try {
      const resp = await signIn('google', {
        redirect: false,
      });
      if (!resp) {
        openError('Falha ao autenticar via Google', 'Atenção!', 'error');
      }
    } catch (error) {
      let mensagem;
      if (error instanceof Error) {
        mensagem = error.message;
      } else {
        mensagem = 'Falha ao autenticar via Google';
      }
      openError(mensagem, 'Atenção!', 'error');
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
