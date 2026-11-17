import { AccessNotice } from '@/_components/layout/accessNotice';
import { AuthHeroPanel } from '@/_components/layout/authHeroPanel';
import { Logo } from '@/_components/layout/logo';
import { Title } from '@/_components/ui/title';
import { isGoogleSignInEnabled } from '@/_lib/googleSignIn';
import { Suspense } from 'react';
import { LoginByAccount } from './loginByAccount';
import { LoginByGoogle } from './loginByGoogle';
import { NewPasswordWrapper } from './newPasswordWrapper';
import { SigninLinks } from './signinLinks';

/** The Google option exists only where Google sign-in is configured. */
function GoogleSignInOption() {
  if (!isGoogleSignInEnabled()) return null;

  return (
    <div className="flex flex-col items-center w-full gap-3">
      <Title
        label="Ou acesse com"
        size="h2"
        className=""
        titlePosition="center"
      />
      <div className="flex gap-4">
        <LoginByGoogle />
      </div>
    </div>
  );
}

export function SigninView() {
  return (
    <main
      id="main-content"
      className="flex flex-col w-full min-h-dvh items-center justify-center content-center p-4"
    >
      {/* A refused Google sign-in comes back here with `?aviso=`: this is
          where the person learns why (US-004.EC-4). Suspense because the
          component reads `useSearchParams`. */}
      <Suspense fallback={null}>
        <AccessNotice />
      </Suspense>
      <div className="flex flex-row w-full md:w-11/12 xl:w-8/12 2xl:w-6/12 rounded-2xl overflow-hidden shadow-lg border border-secondary">
        <AuthHeroPanel caption="Continue acompanhando treinos, nutrição e sono — tudo em um só lugar." />
        <div className="flex flex-col w-full gap-5 p-6 md:p-10 py-12 justify-center items-center bg-[url('/backgroundLogo.svg')] bg-cover bg-no-repeat bg-right">
          <Logo className="w-56 md:w-72" />
          <Title
            label="Acesse sua conta"
            size="h1"
            className="mb-2"
            titlePosition="center"
          />
          <LoginByAccount />
          <GoogleSignInOption />
          <SigninLinks />
        </div>
      </div>
      <NewPasswordWrapper />
    </main>
  );
}
