'use client';

import { useReceptionistCheckin } from '@/_hooks/useReceptionistCheckin';
import { SelectedStudentCheckin } from './selectedStudentCheckin';
import { StudentSearchPanel } from './studentSearchPanel';

export function ReceptionistCheckinView() {
  const flow = useReceptionistCheckin();

  if (flow.selected) {
    return (
      <SelectedStudentCheckin
        student={flow.selected}
        confirmation={flow.confirmation}
        isPending={flow.checkInPending}
        error={flow.checkInError}
        onConfirm={() => void flow.confirm()}
        onBack={() => flow.setSelected(null)}
        onReset={flow.reset}
      />
    );
  }

  return (
    <StudentSearchPanel
      query={flow.query}
      results={flow.results}
      isPending={flow.searchPending}
      error={flow.searchError}
      onQueryChange={flow.setQuery}
      onSearch={() => void flow.runSearch()}
      onSelect={flow.setSelected}
    />
  );
}
