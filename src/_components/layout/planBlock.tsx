'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/_components/ui/tooltip';
import type { PlanSummary } from '@/_lib/planSummary';
import { useSidebar } from '@/_components/ui/sidebar';
import { Sparkles, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

interface PlanBlockProps {
  plan: PlanSummary;
}

/**
 * O rodapé é informativo: mostra a mesma frase do card ("Renova em …" /
 * "Expira em …") e nunca oferece cancelar ou reativar (US-004.AC-2). Sem data
 * — Gratuito ou perfil indisponível — não se escreve nada.
 */
export function PlanBlock({ plan }: PlanBlockProps) {
  const { state } = useSidebar();
  const detail = plan.detail;

  if (state === 'collapsed') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={plan.cta.href}
            className="flex size-8 items-center justify-center rounded-md bg-secondary text-icon-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="sr-only">{plan.name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {detail ? `${plan.name} — ${detail.label}` : plan.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-line bg-secondary/40 p-3">
      <div className="flex items-center gap-2">
        <Sparkles
          className="size-4 shrink-0 text-icon-accent"
          aria-hidden="true"
        />
        <span className="truncate text-sm font-semibold">{plan.name}</span>
      </div>
      {/* O alerta se distingue por ícone e texto, nunca só pela cor, e o
          leitor de tela o anuncia como texto comum (US-002.EC-4,
          US-004.EC-3). */}
      {detail &&
        (detail.kind === 'expires' ? (
          <span
            role="status"
            className="inline-flex w-fit items-center gap-1 rounded-md bg-warn-bg px-1.5 py-1 text-xs font-medium text-warn"
          >
            <TriangleAlert className="size-3 shrink-0" aria-hidden="true" />
            {detail.label}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{detail.label}</span>
        ))}
      <Link
        href={plan.cta.href}
        className="mt-1 w-fit text-xs font-medium underline underline-offset-4 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        {plan.cta.label}
      </Link>
    </div>
  );
}
