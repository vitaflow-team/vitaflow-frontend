import { Eye } from 'lucide-react';
import type { ReactNode } from 'react';

interface ViewAsBannerViewProps {
  targetLabel: string;
  exitControl: ReactNode;
}

export function ViewAsBannerView({
  targetLabel,
  exitControl,
}: ViewAsBannerViewProps) {
  return (
    <div className="bg-amber-500 text-amber-950 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm font-medium">
      <span className="flex items-center gap-2">
        <Eye className="size-4 shrink-0" aria-hidden />
        Você está vendo como: {targetLabel} — modo somente leitura.
      </span>
      {exitControl}
    </div>
  );
}
