import DefaultLayout from '@/_components/layout/defaultLayout';
import { StudentHeader } from '@/_components/students/studentHeader';
import { StudentNotFound } from '@/_components/students/studentNotFound';
import { StudentTabs } from '@/_components/students/studentTabs';
import { redirectUnlessEducator } from '@/_lib/studentsAuthorization';
import { isLoadFailure, loadStudent } from '@/_lib/studentsData';
import type { ReactNode } from 'react';

interface StudentLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

/**
 * The record shell: header and tabs around whichever tab is open. The student
 * is loaded here once per request; the tab pages ask `loadStudent` again and
 * share that single call.
 */
export default async function StudentLayout({
  children,
  params,
}: StudentLayoutProps) {
  await redirectUnlessEducator();
  const { id } = await params;
  const student = await loadStudent(id);

  if (isLoadFailure(student)) {
    return (
      <DefaultLayout>
        <StudentNotFound reason={student} />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <StudentHeader student={student} />
        <StudentTabs studentId={student.id}>{children}</StudentTabs>
      </div>
    </DefaultLayout>
  );
}
