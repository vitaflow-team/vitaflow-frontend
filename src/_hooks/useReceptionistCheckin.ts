import { receptionistCheckIn } from '@/_actions/checkin/receptionistCheckIn';
import {
  searchStudents,
  type ReceptionistStudent,
} from '@/_actions/checkin/searchStudents';
import type { CheckinConfirmation } from '@/_types/checkinConfirmation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

/** The receptionist flow: search, choose a student, register the check-in and keep its result. */
export function useReceptionistCheckin() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReceptionistStudent[] | null>(null);
  const [selected, setSelected] = useState<ReceptionistStudent | null>(null);
  const [confirmation, setConfirmation] = useState<CheckinConfirmation | null>(
    null
  );
  const search = useServerAction(searchStudents);
  const checkIn = useServerAction(receptionistCheckIn);

  async function runSearch() {
    setSelected(null);
    setConfirmation(null);
    const [data] = await search.execute({ search: query });
    setResults(data ?? []);
  }

  async function confirm() {
    if (!selected) return;
    const [result, error] = await checkIn.execute({ clientId: selected.id });
    if (!error && result) {
      setConfirmation({ createdAt: result.createdAt, notice: result.notice });
    }
  }

  function reset() {
    setSelected(null);
    setConfirmation(null);
    setResults(null);
    setQuery('');
  }

  return {
    query,
    results,
    selected,
    confirmation,
    searchPending: search.isPending,
    searchError: search.isError ? search.error.message : null,
    checkInPending: checkIn.isPending,
    checkInError: checkIn.isError ? checkIn.error.message : null,
    setQuery,
    setSelected,
    runSearch,
    confirm,
    reset,
  };
}
