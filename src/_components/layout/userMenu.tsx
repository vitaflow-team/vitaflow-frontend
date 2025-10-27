'use client';

import { getInitialsName } from '@/_lib/getInitials';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserMenu() {
  const { data: session } = useSession();

  console.log(session);

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
          <DropdownMenuLabel className="w-full text-center">
            Minha conta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-b-[2px]" />
          <DropdownMenuItem icon={User}>Meu perfil</DropdownMenuItem>
          <DropdownMenuItem icon={Settings}>Configurações</DropdownMenuItem>
          <DropdownMenuSeparator className="border-b-[2px]" />
          <DropdownMenuItem icon={LogOut} onClick={() => signOut()}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
