import {
  RecordFormActions,
  RecordFormDecimalField,
  RecordFormHeightSummary,
  RecordFormMainFields,
  RecordFormStepButton,
  RecordFormWeightField,
  RecordFormWeightReference,
} from '@/_components/progress/recordFormFields';
import { Form } from '@/_components/ui/form';
import type { MeasurementRecordFormInput } from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

const LATEST: MeasurementRecordResponseDTO = {
  id: 'rec-1',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: '2026-09-15T15:00:00Z',
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
};

const STEPPER = {
  isPending: false,
  currentWeightKg: 82.4,
  onStep: () => {},
  canStep: () => true,
};

function FormHarness({ children }: { children: ReactNode }) {
  const methods = useForm<MeasurementRecordFormInput>({
    defaultValues: {
      weightKg: '82,4',
      heightCm: '168,0',
      waistCm: '',
      hipCm: '',
    },
  });
  return (
    <Form {...methods}>
      <form>{children}</form>
    </Form>
  );
}

function render(node: ReactNode) {
  return renderToStaticMarkup(<FormHarness>{node}</FormHarness>);
}

describe('refactor — RecordForm decimal and weight fields', () => {
  // UT-001
  it('renders a decimal field with its label, value and required marker', () => {
    const required = render(
      <RecordFormDecimalField
        name="heightCm"
        label="Altura (cm)"
        required
        disabled={false}
      />
    );
    const optional = render(
      <RecordFormDecimalField name="waistCm" label="Cintura (cm)" disabled />
    );

    expect(required).toContain('Altura (cm)');
    expect(required).toContain('value="168,0"');
    expect(required).toContain('inputMode="decimal"');
    expect(required).toContain('border-l-4 border-l-primary');
    expect(optional).toContain('Cintura (cm)');
    expect(optional).not.toContain('border-l-4 border-l-primary');
    // `Input` consumes `disabled` to dim its wrapper instead of forwarding it.
    expect(optional).toContain('opacity-60');
    expect(required).not.toContain('opacity-60');
  });

  // UT-001
  it('renders the weight field between both stepper buttons', () => {
    const sheet = render(<RecordFormWeightField layout="sheet" {...STEPPER} />);
    const dialog = render(
      <RecordFormWeightField layout="dialog" {...STEPPER} />
    );

    expect(sheet).toContain('value="82,4"');
    expect(sheet).toContain('aria-label="Diminuir peso"');
    expect(sheet).toContain('aria-label="Aumentar peso"');
    expect(sheet).toContain('sr-only');
    expect(sheet).toContain('[&amp;_input]:text-4xl');
    expect(dialog).not.toContain('[&amp;_input]:text-4xl');
    expect(dialog).toContain('Peso (kg)');
  });

  // UT-005
  it('disables a step button at the weight limit or while saving', () => {
    const atLimit = renderToStaticMarkup(
      <RecordFormStepButton direction={-1} {...STEPPER} currentWeightKg={0} />
    );
    const saving = renderToStaticMarkup(
      <RecordFormStepButton direction={1} {...STEPPER} isPending />
    );
    const free = renderToStaticMarkup(
      <RecordFormStepButton direction={1} {...STEPPER} />
    );

    expect(atLimit).toContain('disabled=""');
    expect(saving).toContain('disabled=""');
    expect(free).not.toContain('disabled=""');
  });
});

describe('refactor — RecordForm layout pieces', () => {
  // UT-001 / UT-005
  it('shows the weight reference only when there is a reference record', () => {
    const withReference = renderToStaticMarkup(
      <RecordFormWeightReference
        layout="sheet"
        referenceRecord={LATEST}
        weightDelta="sem alteração"
      />
    );
    const withoutReference = renderToStaticMarkup(
      <RecordFormWeightReference
        layout="sheet"
        referenceRecord={null}
        weightDelta={null}
      />
    );

    expect(withReference).toContain('Último: 82,4 kg em 15/09/2026');
    expect(withReference).toContain('sem alteração');
    expect(withReference).toContain('items-center text-center');
    expect(withoutReference).toBe('');
  });

  // UT-001 (US-001.EC-1: one shared stepper, sheet/dialog parity)
  it('lays the main fields out per layout with the same stepper', () => {
    const props = { ...STEPPER, referenceRecord: LATEST, weightDelta: null };
    const sheet = render(<RecordFormMainFields layout="sheet" {...props} />);
    const dialog = render(<RecordFormMainFields layout="dialog" {...props} />);

    expect(sheet).toContain('Peso atual');
    expect(sheet).not.toContain('Altura (cm)');
    expect(dialog).not.toContain('Peso atual');
    expect(dialog).toContain('Altura (cm)');
    expect(sheet).toContain('aria-label="Diminuir peso"');
    expect(dialog).toContain('aria-label="Diminuir peso"');
    expect(sheet).toContain('Último: 82,4 kg em 15/09/2026');
    expect(dialog).toContain('Último: 82,4 kg em 15/09/2026');
  });

  // UT-001 / UT-005
  it('collapses the sheet height to the last value until revealed', () => {
    const base = { isPending: false, onReveal: () => {} };
    const collapsed = render(
      <RecordFormHeightSummary
        {...base}
        showHeight={false}
        previousHeightCm={168}
      />
    );
    const revealed = render(
      <RecordFormHeightSummary {...base} showHeight previousHeightCm={168} />
    );
    const noHistory = render(
      <RecordFormHeightSummary
        {...base}
        showHeight={false}
        previousHeightCm={undefined}
      />
    );

    expect(collapsed).toContain('Altura · 168,0 cm (última)');
    expect(collapsed).toContain('aria-expanded="false"');
    expect(collapsed).not.toContain('name="heightCm"');
    expect(revealed).toContain('name="heightCm"');
    expect(noHistory).toContain('name="heightCm"');
    expect(noHistory).not.toContain('(última)');
  });

  // UT-001
  it('renders cancel only on the dialog and a pending label while saving', () => {
    const sheet = renderToStaticMarkup(
      <RecordFormActions layout="sheet" isPending={false} onCancel={() => {}} />
    );
    const dialog = renderToStaticMarkup(
      <RecordFormActions layout="dialog" isPending onCancel={() => {}} />
    );

    expect(sheet).not.toContain('Cancelar');
    expect(sheet).toContain('Salvar registro');
    expect(sheet).toContain('sticky bottom-0');
    expect(dialog).toContain('Cancelar');
    expect(dialog).toContain('Salvando…');
  });
});
