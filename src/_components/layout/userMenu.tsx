'use client';

import { getInitialsName } from '@/_lib/getInitials';
import { LogOut, Mail, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserMenu() {
  const { data: session } = useSession();
  const route = useRouter();

  const imageUser: string =
    session &&
    session.user &&
    session.user.image !== null &&
    session.user.image !== undefined
      ? session.user.image
      : '';

  return (
    <div className="flex items-center gap-4 sm:gap-8 w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border-2 h-12 w-12">
            <AvatarImage src={imageUser} />
            <AvatarFallback>
              {getInitialsName(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mx-2">
          <DropdownMenuItem icon={Mail}>Notificações</DropdownMenuItem>
          <DropdownMenuItem
            icon={Settings}
            onClick={() => route.push('/restrict/settings')}
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
