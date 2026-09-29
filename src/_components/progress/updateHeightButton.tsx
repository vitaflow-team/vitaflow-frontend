import { Button } from '@/_components/ui/button';
import { RecordFormModal } from './recordFormModal';

/**
 * Height card shortcut: opens the same quick record with the focus already on
 * the height field. `RecordFormModal` is the client boundary, so this button
 * and the summary card around it render on the server.
 */
export function UpdateHeightButton() {
  return (
    <RecordFormModal
      focusField="heightCm"
      trigger={
        <Button
          variant="link"
          className="mt-0.5 h-auto justify-start px-0 py-2 text-[0.6875rem] md:text-sm"
        >
          Atualizar
        </Button>
      }
    />
  );
}
