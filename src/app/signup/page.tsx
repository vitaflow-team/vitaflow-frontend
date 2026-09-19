import type { Metadata } from 'next';
import { SignupForm } from './signupForm';

export const metadata: Metadata = {
  title: 'Criar Conta Gratuita',
  description:
    'Crie sua conta gratuita na Vita Flow e comece a acompanhar treinos, nutrição e evolução hoje mesmo.',
};

export default function SignupPage() {
  return <SignupForm />;
}
