import type { WorkoutSummary } from '@/_types/educatorWorkouts';
import type { ReactNode } from 'react';
import { WorkoutSummaryCard } from './workoutSummaryCard';

interface WorkoutGroupProps {
  title: string;
  studentId: string;
  workouts: WorkoutSummary[];
  /** What to say when the group is empty; absent means the group is hidden. */
  emptyText?: string;
  children?: ReactNode;
}

/** A titled group of the list (active, drafts or archived). */
export function WorkoutGroup({
  title,
  studentId,
  workouts,
  emptyText,
  children,
}: WorkoutGroupProps) {
  if (workouts.length === 0 && !emptyText) return null;

  return (
    <section aria-label={title} className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold">{title}</h3>
      {workouts.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="flex flex-col">
          {workouts.map(workout => (
            <WorkoutSummaryCard
              key={workout.id}
              studentId={studentId}
              workout={workout}
            />
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}
