import { renderToString } from 'react-dom/server';
import { ChapelLocator, filterChapelsList, createChapelFilterHelpers, INITIAL_CHAPELS } from '../../src/components/ChapelLocator';

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

  it('covers filterChapelsList and createChapelFilterHelpers', () => {
    const ncr = filterChapelsList(INITIAL_CHAPELS, 'NCR', false, '');
    expect(ncr.length).toBe(2);

    let search = '';
    let region = '';
    let crem = false;
    const helpers = createChapelFilterHelpers(
      (s) => { search = s; },
      (r) => { region = r; },
      (fn) => { crem = typeof fn === 'function' ? fn(crem) : fn; return crem; }
    );
    helpers.updateSearch('Mandaue');
    expect(search).toBe('Mandaue');
    helpers.updateRegion('Region VII');
    expect(region).toBe('Region VII');
    helpers.toggleCrem();
    expect(crem).toBe(true);
  });
});