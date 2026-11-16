interface AiExplanationPanelProps {
  explanation: string | null | undefined;
}

/**
 * The educator-only prose explanation of an AI-generated plan
 * (ai-workout-prescription-b2b ADR-006/ADR-010) — renders nothing when the
 * draft was never AI-generated, or when its explanation call failed and
 * degraded to null. Never rendered on any student-facing page.
 */
export function AiExplanationPanel({ explanation }: AiExplanationPanelProps) {
  if (!explanation) return null;

  return (
    <div className="rounded-lg border border-line bg-secondary/40 p-4">
      <h3 className="text-sm font-semibold">Explicação da IA</h3>
      <p className="mt-1 text-sm text-muted-foreground">{explanation}</p>
    </div>
  );
}
