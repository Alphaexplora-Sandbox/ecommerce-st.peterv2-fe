import { renderToString } from 'react-dom/server';
import { App } from '../../src/App';

describe('App', () => {
  it('renders the default service title', () => {
    const html = renderToString(<App />);
    expect(html).toContain('ecommerce-stpeterv2-frontend');
    expect(html).toContain('Guaranteed Peace of Mind for Generations to Come');
    expect(html).toContain('Flagship Memorial Plans Catalog');
  });

  it('renders a custom title', () => {
    const html = renderToString(<App title="e-StPeter Official Portal" />);
    expect(html).toContain('e-StPeter Official Portal');
  });

  it('renders all tab views via initialTab', () => {
    const tabs = ['catalog', 'calculator', 'enrollment', 'checkout', 'dashboard', 'chapels', 'eburol'] as const;
    tabs.forEach((tab) => {
      const html = renderToString(<App initialTab={tab} />);
      expect(html).toContain('st-peter-app');
    });
  });

  it('renders footer regulatory disclosure', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Insurance Commission of the Philippines');
    expect(html).toContain('St. Peter Life Plan, Inc. &amp; Chapels');
  });
});