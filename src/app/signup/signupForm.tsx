'use client';

import { AuthHeroPanel } from '@/_components/layout/authHeroPanel';
import { Logo } from '@/_components/layout/logo';
import { Button } from '@/_components/ui/button';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Form } from '@/_components/ui/form';
import { Title } from '@/_components/ui/title';
import { useSignupForm } from '@/_hooks/useSignupForm';
import { ArrowLeft } from 'lucide-react';
import { SignupCredentialsFields } from './signupCredentialsFields';
import { SignupHealthConsentField, SignupTermsField } from './signupTermsField';

export function SignupForm() {
  const { methods, isPending, onSubmit } = useSignupForm();

  return (
    <main
      id="main-content"
      className="flex flex-col w-full min-h-dvh items-center justify-center content-center p-4"
    >
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 rounded-2xl overflow-hidden shadow-lg border border-secondary">
        <AuthHeroPanel caption="Comece hoje a acompanhar sua evolução com o apoio de quem entende." />
        <div className="flex flex-col w-full gap-6 p-6 md:p-10 py-6 md:py-16 justify-center items-center bg-[url('/backgroundLogo.svg')] bg-cover bg-no-repeat bg-right">
          <Logo className="w-56 md:w-72" />
          <Title
            label="Crie sua conta gratuita"
            size="h1"
            className="mb-2"
            titlePosition="center"
          />
          <Form {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col w-full">
              <SignupCredentialsFields disabled={isPending} />
              <SignupTermsField disabled={isPending} />
              <SignupHealthConsentField disabled={isPending} />
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                Criar conta
              </Button>
            </form>
          </Form>
          <ButtonLink
            variant="link"
            url="/signin"
            label="Voltar para o login"
            icon={ArrowLeft}
          />
        </div>
      </div>
    </main>
  );
}
