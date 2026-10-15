'use client';

import { assignAccessPlan } from '@/_actions/academia/assignAccessPlan';
import { getCurrentAccessPlan } from '@/_actions/academia/getCurrentAccessPlan';
import { listAccessPlansCatalog } from '@/_actions/academia/listAccessPlansCatalog';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { FormError } from '@/_components/students/formError';
import type { AcademiaAccessPlan } from '@/_types/academia';
import type { CurrentAccessPlan } from '@/_types/studentAccessPlan';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

const STATUS_LABELS: Record<CurrentAccessPlan['status'], string> = {
  NO_PLAN: 'Sem plano atribuído',
  VALID: 'Válido',
  EXPIRED: 'Fora da validade',
  EXHAUSTED: 'Acessos esgotados',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface StudentAccessPlanPanelProps {
  clientId: string;
  studentName: string;
}

export function StudentAccessPlanPanel({
  clientId,
  studentName,
}: StudentAccessPlanPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<CurrentAccessPlan | null>(null);
  const [catalog, setCatalog] = useState<AcademiaAccessPlan[]>([]);
  const load = useServerAction(getCurrentAccessPlan);
  const loadCatalog = useServerAction(listAccessPlansCatalog);
  const assign = useServerAction(assignAccessPlan);

  async function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) return;
    const [[currentData], [catalogData]] = await Promise.all([
      load.execute({ clientId }),
      loadCatalog.execute(),
    ]);
    if (currentData) setCurrent(currentData);
    if (catalogData) setCatalog(catalogData);
  }

  async function handleAssign(accessPlanId: string) {
    const [, error] = await assign.execute({ clientId, accessPlanId });
    if (!error) {
      const [currentData] = await load.execute({ clientId });
      if (currentData) setCurrent(currentData);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={isOpen => void handleOpen(isOpen)}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <CreditCard aria-hidden="true" />
          Plano de acesso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plano de acesso de {studentName}</DialogTitle>
        </DialogHeader>
        {current && (
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{STATUS_LABELS[current.status]}</span>
            {current.plan?.validityType === 'DAYS' &&
              current.plan.expiresAt && (
                <span className="text-muted-foreground">
                  Expira em {formatDate(current.plan.expiresAt)}
                </span>
              )}
            {current.plan?.validityType === 'VISITS' && (
              <span className="text-muted-foreground">
                {current.remaining} acessos restantes
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {current?.status === 'NO_PLAN' ? 'Atribuir plano' : 'Trocar plano'}
          </span>
          {catalog.map(plan => (
            <Button
              key={plan.id}
              type="button"
              variant="outline"
              className="w-full justify-start"
              disabled={assign.isPending}
              onClick={() => void handleAssign(plan.id)}
            >
              {plan.name}
            </Button>
          ))}
        </div>
        <FormError message={assign.isError ? assign.error.message : null} />
      </DialogContent>
    </Dialog>
  );
}
