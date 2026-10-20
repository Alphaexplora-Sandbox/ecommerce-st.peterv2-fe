import { renderToString } from 'react-dom/server';
import { DashboardView } from '../../src/components/DashboardView';

describe('DashboardView', () => {
  it('renders active plan card with amortization progress', () => {
    const html = renderToString(<DashboardView />);
    expect(html).toContain('Planholder Self-Service Dashboard');
    expect(html).toContain('STP-2026-88421');
    expect(html).toContain('Rosa Santos');
    expect(html).toContain('Amortization Progress');
    expect(html).toContain('23');
    expect(html).toContain('Pay Next Installment');
  });

  it('renders trust and anti-inflation guarantees', () => {
    const html = renderToString(<DashboardView />);
    expect(html).toContain('Full Anti-Inflation Lock');
    expect(html).toContain('Transferability Rights');
    expect(html).toContain('Accredited Chapels');
  });
});