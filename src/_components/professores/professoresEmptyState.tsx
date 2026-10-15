import { InviteProfessorPanel } from './inviteProfessorPanel';

export function ProfessoresEmptyState() {
  return (
    <section
      aria-labelledby="professores-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="professores-empty-title" className="text-lg font-semibold">
        Você ainda não tem professores
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Convide um educador físico pelo e-mail para que ele passe a atender os
        alunos da sua academia.
      </p>
      <InviteProfessorPanel />
    </section>
  );
}
