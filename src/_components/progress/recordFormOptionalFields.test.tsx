import { RecordFormOptionalFields } from '@/_components/progress/recordFormOptionalFields';
import { Form } from '@/_components/ui/form';
import type { MeasurementRecordFormInput } from '@/_schema/progress';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

function Harness({ open }: { open: boolean }) {
  const methods = useForm<MeasurementRecordFormInput>({
    defaultValues: { weightKg: '', heightCm: '', waistCm: '80,0', hipCm: '' },
  });
  return (
    <Form {...methods}>
      <RecordFormOptionalFields
        open={open}
        onToggle={() => {}}
        disabled={false}
      />
    </Form>
  );
}

describe('refactor — RecordFormOptionalFields', () => {
  // UT-005
  it('starts collapsed with only the toggle', () => {
    const markup = renderToStaticMarkup(<Harness open={false} />);

    expect(markup).toContain('Outras medidas (opcional)');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).not.toContain('Cintura (cm)');
    expect(markup).not.toContain('Quadril (cm)');
  });

  // UT-001
  it('shows waist and hip without the required marker when open', () => {
    const markup = renderToStaticMarkup(<Harness open />);

    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain('Cintura (cm)');
    expect(markup).toContain('Quadril (cm)');
    expect(markup).toContain('value="80,0"');
    expect(markup).not.toContain('border-l-4 border-l-primary');
  });
});
