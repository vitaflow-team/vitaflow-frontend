'use client';

import {
  buildGreetingLine,
  formatLongDate,
  getGreeting,
} from '@/_lib/greeting';
import { useEffect, useState } from 'react';

const SERVER_TIME_ZONE = 'America/Sao_Paulo';

interface GreetingProps {
  /** Instante gerado no servidor, para a primeira renderização ser igual nos dois lados. */
  nowIso: string;
  firstName: string;
}

export function Greeting({ nowIso, firstName }: GreetingProps) {
  // Servidor e primeira renderização do cliente usam o mesmo instante e o mesmo
  // fuso, então não há divergência de hidratação. Depois da montagem o relógio
  // do navegador assume, que é a hora que o usuário realmente vê no aparelho.
  const [clock, setClock] = useState<{ now: Date; timeZone?: string }>(() => ({
    now: new Date(nowIso),
    timeZone: SERVER_TIME_ZONE,
  }));

  useEffect(() => {
    setClock({ now: new Date(), timeZone: undefined });
  }, []);

  const greeting = getGreeting(clock.now, clock.timeZone);

  return (
    // `min-w-0` e `break-words` seguram um nome de uma palavra só muito longa:
    // sem eles a saudação vira a largura mínima da linha e empurra o botão de
    // registrar para fora da tela.
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className="text-2xl font-semibold break-words sm:text-3xl">
        {buildGreetingLine(greeting, firstName)}
      </h1>
      <p className="text-sm text-muted-foreground first-letter:uppercase">
        {formatLongDate(clock.now, clock.timeZone)}
      </p>
    </div>
  );
}
