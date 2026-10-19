import { renderToString } from 'react-dom/server';
import { ChapelLocator, INITIAL_CHAPELS } from '../../src/components/ChapelLocator';

describe('ChapelLocator', () => {
  it('renders chapel search and accredited chapels', () => {
    const html = renderToString(<ChapelLocator />);
    expect(html).toContain('Accredited St. Peter Chapel Directory');
    expect(html).toContain('St. Peter Chapel Quezon City');
    expect(html).toContain('St. Peter Chapel Commonwealth');
    expect(html).toContain('St. Peter Chapel Mandaue');
    expect(html).toContain('St. Peter Chapel Davao');
  });

  it('has initial chapels constant defined with 5 locations', () => {
    expect(INITIAL_CHAPELS.length).toBe(5);
    expect(INITIAL_CHAPELS[0].region).toBe('NCR');
  });
});