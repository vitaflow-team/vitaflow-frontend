import { AddStudentPanel } from './addStudentPanel';

/** First use: says what the area is for and offers the one next step. */
export function StudentsEmptyState() {
  return (
    <section
      aria-labelledby="students-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="students-empty-title" className="text-lg font-semibold">
        Você ainda não tem alunos
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Cadastre seu primeiro aluno para registrar avaliações físicas e
        acompanhar a evolução dele. Se ele já tem conta no Vita Flow, você pode
        vincular o cadastro à conta pelo e-mail.
      </p>
      <AddStudentPanel triggerLabel="Adicionar aluno" />
    </section>
  );
}
