'use client';

import {
  activeStudentTab,
  studentPanelId,
  studentTabId,
} from '@/_lib/studentsTabs';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { StudentTabList } from './studentTabList';

interface StudentTabsProps {
  studentId: string;
  children: ReactNode;
}

/** The tab list and its panel; the active tab follows the address. */
export function StudentTabs({ studentId, children }: StudentTabsProps) {
  const selected = activeStudentTab(usePathname(), studentId);

  return (
    <>
      <StudentTabList studentId={studentId} selected={selected} />
      <div
        role="tabpanel"
        id={studentPanelId(selected)}
        aria-labelledby={studentTabId(selected)}
        className="pt-4"
      >
        {children}
      </div>
    </>
  );
}
