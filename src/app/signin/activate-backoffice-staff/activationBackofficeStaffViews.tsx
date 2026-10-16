import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';

export function ActivationBackofficeStaffSuccess() {
  return (
    <>
      <Title
        label="Tudo pronto!"
        size="h1"
        className="mb-4 text-2xl"
        titlePosition="center"
      />
      <span className="text-lg w-full">
        Sua senha foi definida e seu acesso interno da equipe Vita Flow já está
        ativo.
      </span>
      <ButtonLink
        label="Ir para o login"
        url="/signin"
        variant="default"
        className="w-full py-6 text-lg"
      />
    </>
  );
}
