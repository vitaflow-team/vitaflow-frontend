'use client';

import { UserAvatar } from '@/_components/layout/userAvatar';
import { useSidebar } from '@/_components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/_components/ui/tooltip';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserBlockProps {
  firstName: string;
  avatar: string | null;
}

const SIGN_OUT_LABEL = 'Sair da conta';

function handleSignOut() {
  signOut({ callbackUrl: '/' });
}

export function UserBlock({ firstName, avatar }: UserBlockProps) {
  const { state } = useSidebar();

  // Sem nome, UserAvatar já cai no ícone neutro e nenhum texto de nome é
  // renderizado — nada de espaço reservado vazio.
  if (state === 'collapsed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <UserAvatar size="sm" src={avatar} name={firstName || null} />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex size-8 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="sr-only">{SIGN_OUT_LABEL}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{SIGN_OUT_LABEL}</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <UserAvatar size="sm" src={avatar} name={firstName || null} />
        {firstName && (
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {firstName}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        {SIGN_OUT_LABEL}
      </button>
    </div>
  );
}
