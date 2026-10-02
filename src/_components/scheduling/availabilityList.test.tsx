import type { AvailabilityWindow } from '@/_types/scheduling';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AvailabilityList } from './availabilityList';

function window(
  overrides: Partial<AvailabilityWindow> = {}
): AvailabilityWindow {
  return {
    id: 'window-1',
    professionalId: 'professional-1',
    dayOfWeek: 1,
    startMinute: 540,
    endMinute: 720,
    sessionDurationMinutes: 45,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('AvailabilityList', () => {
  // US-001.EC-2
  it('shows an explicit empty state with nothing published, not a blank area', () => {
    const html = renderToStaticMarkup(<AvailabilityList windows={[]} />);
    expect(html).toContain('ainda não publicou');
  });

  it('lists a window with its day, time range, and duration', () => {
    const html = renderToStaticMarkup(
      <AvailabilityList windows={[window()]} />
    );
    expect(html).toContain('Segunda');
    expect(html).toContain('09:00');
    expect(html).toContain('12:00');
    expect(html).toContain('45 min');
  });
});
