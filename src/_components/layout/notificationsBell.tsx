'use client';

import { Button } from '@/_components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover';
import { Bell } from 'lucide-react';

/**
 * Painel honesto: enquanto não existe recurso de notificações, o sino nunca
 * mostra ponto nem contador e o texto não promete notificações futuras
 * específicas (ADR-004).
 */
export function NotificationsBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={8}
        className="w-72 max-w-[calc(100vw-1rem)]"
      >
        <p className="text-sm font-semibold">Notificações</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Você não tem notificações.
        </p>
      </PopoverContent>
    </Popover>
  );
}
