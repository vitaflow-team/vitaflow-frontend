'use client';

import {
  activePatientTab,
  patientPanelId,
  patientTabId,
} from '@/_lib/patientsTabs';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { PatientTabList } from './patientTabList';

interface PatientTabsProps {
  patientId: string;
  children: ReactNode;
}

/** The tab list and its panel; the active tab follows the address. */
export function PatientTabs({ patientId, children }: PatientTabsProps) {
  const selected = activePatientTab(usePathname(), patientId);

  return (
    <>
      <PatientTabList patientId={patientId} selected={selected} />
      <div
        role="tabpanel"
        id={patientPanelId(selected)}
        aria-labelledby={patientTabId(selected)}
        className="pt-4"
      >
        {children}
      </div>
    </>
  );
}
