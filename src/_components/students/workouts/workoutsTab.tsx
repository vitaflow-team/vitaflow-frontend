import type { WorkoutList } from '@/_types/educatorWorkouts';
import { ArchivedPagination } from './archivedPagination';
import { NewWorkoutDialog } from './newWorkoutDialog';
import { WorkoutGroup } from './workoutGroup';

interface WorkoutsTabProps {
  studentId: string;
  list: WorkoutList;
}

function isEmpty(list: WorkoutList): boolean {
  return (
    list.active === null &&
    list.drafts.length === 0 &&
    list.archived.total === 0
  );
}

function EmptyWorkouts({ studentId }: { studentId: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line px-4 py-8">
      <p className="text-sm text-muted-foreground">
        Este aluno ainda não tem treinos. Crie o primeiro como rascunho e ative
        quando estiver pronto.
      </p>
      <NewWorkoutDialog studentId={studentId} />
    </div>
  );
}

/** The "Treinos" tab: the active workout, the drafts, a page of the archived. */
export function WorkoutsTab({ studentId, list }: WorkoutsTabProps) {
  return (
    <section aria-labelledby="workouts-title" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 id="workouts-title" className="text-lg font-semibold">
          Treinos
        </h2>
        {!isEmpty(list) && <NewWorkoutDialog studentId={studentId} />}
      </div>
      {isEmpty(list) ? (
        <EmptyWorkouts studentId={studentId} />
      ) : (
        <>
          <WorkoutGroup
            title="Treino ativo"
            studentId={studentId}
            workouts={list.active ? [list.active] : []}
            emptyText="Nenhum treino ativo. O aluno só vê um treino depois que você o ativa."
          />
          <WorkoutGroup
            title="Rascunhos"
            studentId={studentId}
            workouts={list.drafts}
          />
          <WorkoutGroup
            title="Arquivados"
            studentId={studentId}
            workouts={list.archived.items}
            emptyText={
              list.archived.total > 0
                ? 'Não há treinos arquivados nesta página.'
                : undefined
            }
          >
            <ArchivedPagination
              studentId={studentId}
              page={list.archived.page}
              total={list.archived.total}
              pageSize={list.archived.pageSize}
            />
          </WorkoutGroup>
        </>
      )}
    </section>
  );
}
