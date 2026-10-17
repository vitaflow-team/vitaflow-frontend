import { AddPatientPanel } from './addPatientPanel';

/** First use: says what the area is for and offers the one next step. */
export function PatientsEmptyState() {
  return (
    <section
      aria-labelledby="patients-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="patients-empty-title" className="text-lg font-semibold">
        Você ainda não tem pacientes
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Cadastre seu primeiro paciente para registrar anamnese, avaliações e
        montar o plano alimentar. Se ele já tem conta no Vita Flow, o vínculo é
        feito automaticamente pelo e-mail.
      </p>
      <AddPatientPanel triggerLabel="Adicionar paciente" />
    </section>
  );
}
