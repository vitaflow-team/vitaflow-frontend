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
  const resp = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/users/singin',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, socialLogin }),
      cache: 'no-store',
    }
  );

  if (!resp.ok) {
    const error = await resp.json();

    throw new Error(error.message);
  }

  return await resp.json();
}
