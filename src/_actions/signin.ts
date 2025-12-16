import { getEnv } from '@/_lib/getenv';

interface SignInResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  accessToken: string;
}

export async function actionSignIn({
  email,
  password,
  socialLogin = false,
}: {
  email: string;
  password: string;
  socialLogin?: boolean;
}): Promise<SignInResponse | undefined> {
  try {
    const resp = await fetch(getEnv('BACKEND_URL') + '/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, socialLogin }),
      cache: 'no-store',
    });

    if (!resp.ok) {
      let errorMessage = 'Erro ao realizar login.';
      try {
        const errorData = await resp.json();
        if (errorData && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
      } catch {
        // Falha ao fazer parse do JSON de erro, mantém mensagem genérica
      }
      throw new Error(errorMessage);
    }

    return await resp.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      'Ocorreu um erro inesperado ao tentar conectar ao servidor.'
    );
  }
}
