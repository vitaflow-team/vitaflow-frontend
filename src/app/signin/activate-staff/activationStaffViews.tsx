import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';

export function ActivationStaffFailure() {
  return (
    <>
      <Title
        label="Ops!"
        size="h1"
        className="mb-4 text-2xl text-red-500"
        titlePosition="center"
      />
      <span className="text-lg w-full text-center">
        Link de ativação inválido ou expirado.
      </span>
      <span className="text-lg w-full text-center">
        Peça à academia para enviar um novo convite.
      </span>
    </>
  );
}

export function ActivationStaffSuccess() {
  return (
    <>
      <Title
        label="Tudo pronto!"
        size="h1"
        className="mb-4 text-2xl"
        titlePosition="center"
      />
      <span className="text-lg w-full">
        Sua senha foi definida e seu acesso de recepção já está ativo.
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
