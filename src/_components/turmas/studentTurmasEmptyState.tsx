export function StudentTurmasEmptyState() {
  return (
    <section
      aria-labelledby="student-turmas-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="student-turmas-empty-title" className="text-lg font-semibold">
        Nenhuma turma disponível
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Você ainda não tem acesso a turmas de nenhuma academia.
      </p>
    </section>
  );
}
