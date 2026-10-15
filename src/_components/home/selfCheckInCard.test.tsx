import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/checkin/selfCheckIn', () => ({ selfCheckIn: {} }));

import { SelfCheckInCard } from './selfCheckInCard';

describe('SelfCheckInCard — gym-checkin US-001', () => {
  it('shows the one-tap check-in button', () => {
    const html = renderToStaticMarkup(<SelfCheckInCard />);

    expect(html).toContain('Fazer check-in');
  });
});
