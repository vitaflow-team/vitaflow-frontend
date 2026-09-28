import { getBmiPreview } from '@/_lib/bmi';
import {
  formatBmi,
  getBmiStripTone,
  type BmiStripTone,
} from '@/_lib/progressDisplay';
import { cn } from '@/_lib/utils';
import { BmiBadge } from './bmiBadge';

const STRIP_TONE_CLASS: Record<BmiStripTone, string> = {
  'sage-bg': 'bg-sage-bg',
  'info-bg': 'bg-info-bg',
  'warn-bg': 'bg-warn-bg',
  muted: 'bg-muted',
};

interface RecordFormBmiStripProps {
  preview: ReturnType<typeof getBmiPreview>;
}

/** Live BMI preview, tinted by classification; muted until both values exist. */
export function RecordFormBmiStrip({ preview }: RecordFormBmiStripProps) {
  const stripTone = preview ? getBmiStripTone(preview.classification) : 'muted';

  return (
    <div
      aria-live="polite"
      className={cn(
        'flex min-h-20 items-center justify-between gap-3 rounded-xl px-4 py-3',
        STRIP_TONE_CLASS[stripTone]
      )}
    >
      <div>
        <p className="text-sm font-medium">Prévia do IMC</p>
        {preview ? (
          <p className="text-2xl font-semibold">{formatBmi(preview.bmi)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Preencha peso e altura para calcular.
          </p>
        )}
      </div>
      {preview && <BmiBadge classification={preview.classification} />}
    </div>
  );
}
