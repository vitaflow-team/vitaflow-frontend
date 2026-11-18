import { getCurrentAccessPlan } from '@/_actions/academia/getCurrentAccessPlan';
import { listAccessPlansCatalog } from '@/_actions/academia/listAccessPlansCatalog';
import type { AcademiaAccessPlan } from '@/_types/academia';
import type { CurrentAccessPlan } from '@/_types/studentAccessPlan';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

/** What the plan dialog shows: loaded when it opens, reloaded after every change. */
export function useStudentAccessPlan(clientId: string) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<CurrentAccessPlan | null>(null);
  const [catalog, setCatalog] = useState<AcademiaAccessPlan[]>([]);
  const load = useServerAction(getCurrentAccessPlan);
  const loadCatalog = useServerAction(listAccessPlansCatalog);

  async function refreshCurrent() {
    const [currentData] = await load.execute({ clientId });
    if (currentData) setCurrent(currentData);
  }

  async function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) return;
    const [, [catalogData]] = await Promise.all([
      refreshCurrent(),
      loadCatalog.execute(),
    ]);
    if (catalogData) setCatalog(catalogData);
  }

  async function changed() {
    await refreshCurrent();
    router.refresh();
  }

  return { open, handleOpen, current, catalog, changed };
}
