import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  loadIsPremiumMock,
  loadConsentStatusMock,
  loadPhotosByAngleMock,
  loadCompareMock,
} = vi.hoisted(() => ({
  loadIsPremiumMock: vi.fn(),
  loadConsentStatusMock: vi.fn(),
  loadPhotosByAngleMock: vi.fn(),
  loadCompareMock: vi.fn(),
}));

vi.mock('@/_lib/progressPhotosData', () => ({
  loadIsPremium: loadIsPremiumMock,
  loadConsentStatus: loadConsentStatusMock,
  loadPhotosByAngle: loadPhotosByAngleMock,
  loadCompare: loadCompareMock,
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('./premiumGate', () => ({
  PremiumGate: () => <i data-testid="premium-gate" />,
}));
vi.mock('./consentGate', () => ({
  ConsentGate: () => <i data-testid="consent-gate" />,
}));
vi.mock('./angleSelector', () => ({
  AngleSelector: ({ value }: { value: string }) => (
    <i data-testid="angle-selector" data-value={value} />
  ),
}));
vi.mock('./photoHistoryStrip', () => ({
  PhotoHistoryStrip: ({ photos }: { photos: unknown[] }) => (
    <i data-testid="photo-strip" data-count={photos.length} />
  ),
}));
vi.mock('./comparisonView', () => ({
  ComparisonView: () => <i data-testid="comparison-view" />,
}));

import { FotosTab } from './fotosTab';

beforeEach(() => {
  vi.clearAllMocks();
  loadIsPremiumMock.mockResolvedValue(true);
  loadConsentStatusMock.mockResolvedValue(true);
  loadPhotosByAngleMock.mockResolvedValue([]);
});

describe('FotosTab', () => {
  it('shows the Premium gate before anything else for a Free-tier user', async () => {
    loadIsPremiumMock.mockResolvedValue(false);

    const markup = renderToStaticMarkup(await FotosTab({ searchParams: {} }));

    expect(markup).toContain('data-testid="premium-gate"');
    expect(loadConsentStatusMock).not.toHaveBeenCalled();
  });

  it('shows the consent gate for a Premium user who has not consented yet', async () => {
    loadConsentStatusMock.mockResolvedValue(false);

    const markup = renderToStaticMarkup(await FotosTab({ searchParams: {} }));

    expect(markup).toContain('data-testid="consent-gate"');
    expect(loadPhotosByAngleMock).not.toHaveBeenCalled();
  });

  it('shows the angle selector and photo history once Premium and consented', async () => {
    loadPhotosByAngleMock.mockResolvedValue([
      { id: 'a', angle: 'FRONT', signedUrl: 'x', takenAt: '2026-01-01' },
    ]);

    const markup = renderToStaticMarkup(
      await FotosTab({ searchParams: { angle: 'FRONT' } })
    );

    expect(markup).toContain('data-testid="angle-selector"');
    expect(markup).toContain('data-value="FRONT"');
    expect(markup).toContain('data-testid="photo-strip"');
    expect(markup).toContain('data-count="1"');
  });

  it('defaults to FRONT for an unknown or missing angle', async () => {
    const markup = renderToStaticMarkup(
      await FotosTab({ searchParams: { angle: 'DIAGONAL' } })
    );

    expect(markup).toContain('data-value="FRONT"');
  });

  it('shows the comparison view when both compareA and compareB are present', async () => {
    loadCompareMock.mockResolvedValue({
      a: { id: 'a', angle: 'FRONT', signedUrl: 'x', takenAt: '2026-01-01' },
      b: { id: 'b', angle: 'FRONT', signedUrl: 'y', takenAt: '2026-02-01' },
    });

    const markup = renderToStaticMarkup(
      await FotosTab({
        searchParams: { angle: 'FRONT', compareA: 'a', compareB: 'b' },
      })
    );

    expect(markup).toContain('data-testid="comparison-view"');
    expect(loadPhotosByAngleMock).not.toHaveBeenCalled();
  });

  it('shows an error notice when the profile check fails', async () => {
    loadIsPremiumMock.mockResolvedValue('failed');

    const markup = renderToStaticMarkup(await FotosTab({ searchParams: {} }));

    expect(markup).toContain('Não foi possível verificar seu plano');
  });

  it('shows an error notice when the compare request fails', async () => {
    loadCompareMock.mockResolvedValue('failed');

    const markup = renderToStaticMarkup(
      await FotosTab({
        searchParams: { compareA: 'a', compareB: 'b' },
      })
    );

    expect(markup).toContain('Não foi possível comparar');
  });
});
