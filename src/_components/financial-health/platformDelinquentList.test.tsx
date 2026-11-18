import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformDelinquentList } from './platformDelinquentList';

const ITEMS = [
  {
    userId: 'u1',
    name: 'Ana Souza',
    accountType: 'USER' as const,
    planName: 'Premium',
    totalOwedCents: 9990,
    oldestDaysOverdue: 12,
  },
  {
    userId: 'u2',
    name: 'Bruno Lima',
    accountType: 'ACADEMIA' as const,
    planName: 'Plano 2',
    totalOwedCents: 5000,
    oldestDaysOverdue: 3,
  },
];

describe('PlatformDelinquentList', () => {
  it('renders one row per subscriber, in the order received', () => {
    const html = renderToStaticMarkup(<PlatformDelinquentList items={ITEMS} />);

    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html.indexOf('Ana Souza')).toBeLessThan(html.indexOf('Bruno Lima'));
  });

  it('says in words that nobody is delinquent, with no list (US-022.EC-4)', () => {
    const html = renderToStaticMarkup(<PlatformDelinquentList items={[]} />);

    expect(html).toContain('Nenhum assinante inadimplente');
    expect(html).not.toContain('<ul');
  });
});
