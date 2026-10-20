import { renderToString } from 'react-dom/server';
import { Navbar, handleTabSelection, NAV_TABS } from '../../src/components/Navbar';

describe('Navbar', () => {
  it('renders default brand title', () => {
    const html = renderToString(<Navbar activeTab="catalog" onTabChange={() => {}} />);
    expect(html).toContain('ecommerce-stpeterv2-frontend');
    expect(html).toContain('St. Peter Life Plan &amp; Chapels');
    expect(html).toContain('24/7 Hotline: (02) 8371-1234');
  });

  it('renders custom brand title and active tab', () => {
    const html = renderToString(<Navbar title="Custom Brand" activeTab="calculator" onTabChange={() => {}} />);
    expect(html).toContain('Custom Brand');
    expect(html).toContain('active');
  });

  it('renders all tab navigation buttons', () => {
    const html = renderToString(<Navbar activeTab="dashboard" onTabChange={() => {}} />);
    expect(html).toContain('Plans');
    expect(html).toContain('Calculator');
    expect(html).toContain('Enrollment &amp; Beneficiaries');
    expect(html).toContain('Checkout');
    expect(html).toContain('Dashboard');
    expect(html).toContain('Chapels');
    expect(html).toContain('E-Burol');
  });

  it('tests handleTabSelection and NAV_TABS', () => {
    let selected = '';
    const res = handleTabSelection('chapels', (t) => { selected = t; });
    expect(res).toBe('chapels');
    expect(selected).toBe('chapels');
    expect(NAV_TABS.length).toBe(7);
  });
});