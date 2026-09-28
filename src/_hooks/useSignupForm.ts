'use client';

import { actionSignUp } from '@/_actions/users/postSignup';
import { APP_ROUTES } from '@/_constants/routes';
import { useAlertHook } from '@/_hooks/alertHook';
import { signUpFormData, signUpSchema } from '@/_schema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

const SIGNUP_DEFAULTS: signUpFormData = {
  name: '',
  email: '',
  password: '',
  checkPassword: '',
  termsAccepted: false,
  healthDataConsent: false,
};

/** State and submit handler behind `SignupForm`. */
export function useSignupForm() {
  const { isPending, execute } = useServerAction(actionSignUp);
  const router = useRouter();
  const { openError } = useAlertHook();
  const methods = useForm<signUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: SIGNUP_DEFAULTS,
  });

  async function submitSignUp(values: signUpFormData) {
    const [data, error] = await execute(values);
    if (error) {
      openError(
        error.message || 'Erro desconhecido no cadastro.',
        'Atenção!',
        'error'
      );
      return;
    }

    if (data) {
      openError(
        'As instruções de ativação foram enviadas para o seu e-mail.',
        'Cadastro realizado com sucesso!',
        'success'
      );
      router.push(APP_ROUTES.SIGN_IN);
    }
  }

  return { methods, isPending, onSubmit: methods.handleSubmit(submitSignUp) };
}
