'use client';

import { APP_ROUTES } from '@/_constants/routes';
import { Skeleton } from '@/_components/ui/skeleton';
import { getAvatarView } from '@/_lib/avatarView';
import { LogOut, Settings } from 'lucide-react';
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
  const { data: session, status } = useSession();
  const route = useRouter();
  const avatarView = getAvatarView(status, session?.user?.name);

  if (avatarView.kind === 'skeleton') {
    return <Skeleton className="h-12 w-12 rounded-full" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center gap-4 sm:gap-8 w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Abrir menu do usuário">
          <UserAvatar src={session?.user?.avatar} name={avatarView.name} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-2">
          <DropdownMenuItem
            icon={Settings}
            onClick={() => route.push(APP_ROUTES.USER_SETTINGS)}
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
