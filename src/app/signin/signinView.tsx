import { AuthHeroPanel } from '@/_components/layout/authHeroPanel';
import { Logo } from '@/_components/layout/logo';
import { Title } from '@/_components/ui/title';
import { LoginByAccount } from './loginByAccount';
import { LoginByGoogle } from './loginByGoogle';
import { NewPasswordWrapper } from './newPasswordWrapper';
import { SigninLinks } from './signinLinks';

export function SigninView() {
  return (
    <main
      id="main-content"
      className="flex flex-col w-full min-h-dvh items-center justify-center content-center p-4"
    >
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
          <SigninLinks />
        </div>
      </div>
      <NewPasswordWrapper />
    </main>
  );
}
