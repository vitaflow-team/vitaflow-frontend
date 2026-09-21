'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/_components/ui/tooltip';
import type { PlanSummary } from '@/_lib/planSummary';
import { useSidebar } from '@/_components/ui/sidebar';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PlanBlockProps {
  plan: PlanSummary;
}

function detailText(plan: PlanSummary): string | null {
  if (!plan.detail) return null;
  return plan.detail.kind === 'cancels'
    ? `Cancela em ${plan.detail.date}`
    : `Renova em ${plan.detail.date}`;
}

export function PlanBlock({ plan }: PlanBlockProps) {
  const { state } = useSidebar();
  const detail = detailText(plan);

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
          {detail ? `${plan.name} — ${detail}` : plan.name}
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
      {detail && (
        <span className="text-xs text-muted-foreground">{detail}</span>
      )}
      <Link
        href={plan.cta.href}
        className="mt-1 w-fit text-xs font-medium underline underline-offset-4 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        {plan.cta.label}
      </Link>
    </div>
  );
}
