import { activateBilling } from '@/_actions/academia/activateBilling';
import { listEligibleStudents } from '@/_actions/academia/listEligibleStudents';
import {
  activatableIds,
  activateInBatches,
  activationItems,
  toggleSelection,
} from '@/_lib/bulkActivation';
import { defaultDueDay } from '@/_lib/gymBillingForm';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { BatchedActivation } from '@/_types/batchedActivation';
import type { EligibleStudent } from '@/_types/eligibleStudent';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

/** The bulk activation dialog: the eligible students, the selection, and the run in batches (US-015). */
export function useBulkActivation() {
  const router = useRouter();
  const list = useServerAction(listEligibleStudents);
  const activate = useServerAction(activateBilling);
  const [students, setStudents] = useState<EligibleStudent[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [dueDay, setDueDay] = useState(() => defaultDueDay(todayInBrazil()));
  const [outcome, setOutcome] = useState<BatchedActivation | null>(null);
  const [isRunning, setRunning] = useState(false);

  async function load() {
    const [data] = await list.execute();
    setStudents(data ?? []);
    setSelected(activatableIds(data ?? []));
  }

  async function run() {
    setRunning(true);
    const items = activationItems(selected, dueDay);
    setOutcome(await activateInBatches(activate.execute, items));
    setRunning(false);
    await load();
    router.refresh();
  }

  return {
    students,
    selected,
    dueDay,
    outcome,
    loadError: list.isError ? list.error.message : null,
    isLoading: list.isPending,
    isRunning,
    load,
    run,
    setDueDay,
    toggle: (clientId: string) =>
      setSelected(current => toggleSelection(current, clientId)),
    selectAll: () =>
      setSelected((students ?? []).map(student => student.clientId)),
    clear: () => setSelected([]),
  };
}
