import { Logo } from '@/_components/layout/logo';
import { RemoveParams } from '@/_components/layout/removeParams';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';

interface ActivatePageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ActivatePage({
  searchParams,
}: ActivatePageProps) {
  const token = searchParams.token;

  await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  }).catch(() => {
    throw new Error('Erro ao ativar sua conta.');
  });

  return (
    <RemoveParams>
      <div className="flex flex-col w-full items-center justify-center content-center p-4">
        <div className="flex flex-row w-full md:w-4/12 bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right border-[1px]">
          <div className="flex flex-col w-full gap-5 p-4 md:p-10 py-12 justify-center items-center">
            <Logo className="w-64 md:w-80" />
            <Title
              label="Bem-vindo!"
              size="h1"
              className="mb-4 text-2xl"
              titlePosition="center"
            />
            <span className="text-lg w-full">
              Sua senha foi ativada com sucesso e sua conta já está pronta para
              uso.
            </span>
            <span className="text-lg w-full">
              Agora é só entrar na plataforma e começar sua jornada rumo a uma
              vida mais leve, equilibrada e do seu jeito.
            </span>
            <span className="text-lg w-full">
              Conte com a gente para acompanhar seus treinos, cuidar da sua
              saúde e evoluir a cada passo.
            </span>
            <span className="text-lg w-full">Estamos juntos! 💪✨</span>
            <ButtonLink
              label="Ir para o login"
              url="/singin"
              variant="default"
              className="w-full py-6 text-lg"
            />
          </div>
        </div>
      </div>
    </RemoveParams>
  );
}
