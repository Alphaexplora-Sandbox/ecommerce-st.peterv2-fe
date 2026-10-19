import { renderToString } from 'react-dom/server';
import { EBurolView } from '../../src/components/EBurolView';

describe('EBurolView', () => {
  it('renders virtual wake sanctuary and candle action', () => {
    const html = renderToString(<EBurolView />);
    expect(html).toContain('E-Burol™ Virtual Wake &amp; Tribute Portal');
    expect(html).toContain('Tatay Mon');
    expect(html).toContain('Light a Memorial Candle');
    expect(html).toContain('candles lit by loved ones');
    expect(html).toContain('Family Guestbook &amp; Tributes');
  });

  it('renders condolence messages', () => {
    const html = renderToString(<EBurolView />);
    expect(html).toContain('Maria Santos');
    expect(html).toContain('Paolo Santos');
    expect(html).toContain('Send Flower Wreath');
  });
});