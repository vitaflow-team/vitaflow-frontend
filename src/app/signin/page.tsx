import type { Metadata } from 'next';
import { SigninView } from './signinView';

export const metadata: Metadata = {
  title: 'Entrar',
  description:
    'Entre na sua conta Vita Flow para acompanhar treinos, nutrição e evolução.',
};

export default function SigninPage() {
  return <SigninView />;
}
