'use client';

import { APP_ROUTES } from '@/_constants/routes';
import { Bell, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserAvatar } from './userAvatar';

export function UserMenu() {
  const { data: session } = useSession();
  const route = useRouter();

  return (
    <div className="flex items-center gap-4 sm:gap-8 w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            src={session ? session.user.avatar : undefined}
            name={session?.user.name}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-2">
          <DropdownMenuItem icon={Bell}>Notificações</DropdownMenuItem>
          <DropdownMenuItem
            icon={Settings}
            onClick={() => route.push(APP_ROUTES.PRIVATE.SETTINGS)}
          >
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-b-2" />
          <DropdownMenuItem icon={LogOut} onClick={() => signOut()}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
