'use client';

import { Button } from '@/_components/ui/button';
import { APP_ROUTES } from '@/_constants/routes';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

/**
 * Mesmo `signOut` do cliente que o menu do avatar usa (ADR-010) — nada aqui
 * fala com o servidor por conta própria. `redirectTo` é o único acréscimo: sem
 * ele o padrão é a própria URL, e o middleware só *reescreve* `/restrict/...`
 * para a home, deixando o endereço antigo na barra (E2E-009 pede a home).
 */
export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-fit"
      onClick={() => signOut({ redirectTo: APP_ROUTES.HOME })}
    >
      <LogOut aria-hidden="true" />
      Sair da conta
    </Button>
  );
}
