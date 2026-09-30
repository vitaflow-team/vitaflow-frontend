import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/progressPhotos/deletePhoto', () => ({
  actionDeletePhoto: vi.fn(),
}));
vi.mock('./capturePhotoDialog', () => ({
  CapturePhotoDialog: () => <i data-testid="capture-dialog" />,
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));

import type { ProgressPhoto } from '@/_types/progressPhotos';
import { PhotoHistoryStrip } from './photoHistoryStrip';

const PHOTOS: ProgressPhoto[] = [
  {
    id: 'a',
    angle: 'FRONT',
    signedUrl: 'https://x/a.png',
    takenAt: '2026-01-01',
  },
  {
    id: 'b',
    angle: 'FRONT',
    signedUrl: 'https://x/b.png',
    takenAt: '2026-02-01',
  },
];

describe('PhotoHistoryStrip', () => {
  it('shows an explicit empty state instead of a blank strip', () => {
    const markup = renderToStaticMarkup(
      <PhotoHistoryStrip angle="FRONT" photos={[]} />
    );

    expect(markup).toContain('Nenhuma foto para este ângulo ainda');
  });

  it('prompts for a second photo when only one exists (US-004.EC-1)', () => {
    const markup = renderToStaticMarkup(
      <PhotoHistoryStrip angle="FRONT" photos={[PHOTOS[0]]} />
    );

    expect(markup).toContain('Envie uma segunda foto');
  });

  it('renders one thumbnail per photo plus the add-photo tile', () => {
    const markup = renderToStaticMarkup(
      <PhotoHistoryStrip angle="FRONT" photos={PHOTOS} />
    );

    expect(markup).toContain('a.png');
    expect(markup).toContain('b.png');
    expect(markup).toContain('data-testid="capture-dialog"');
  });

  it('never shows the Comparar button before two photos are selected', () => {
    const markup = renderToStaticMarkup(
      <PhotoHistoryStrip angle="FRONT" photos={PHOTOS} />
    );

    expect(markup).not.toContain('Comparar selecionadas');
  });
});
