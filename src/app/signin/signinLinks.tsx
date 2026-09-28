'use client';

// Client because it hands the `ArrowLeft` component to `ButtonLink`: a Server
// Component cannot pass a component reference across the client boundary.
import { ButtonLink } from '@/_components/ui/buttonLink';
import { ArrowLeft } from 'lucide-react';
import ResetPassword from './resetPassword';

/** Sign-up, password reset and back-to-home links under the sign-in form. */
export function SigninLinks() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <ButtonLink url="/signup" label="Não tem conta?" variant="link" />
      <ResetPassword />
      <ButtonLink
        variant="link"
        url="/"
        label="Voltar para a página inicial"
        icon={ArrowLeft}
      />
    </div>
  );
}
