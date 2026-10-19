import { renderToString } from 'react-dom/server';
import { Calculator } from '../../src/components/Calculator';
import { INITIAL_PLANS } from '../../src/components/PlanCatalog';

describe('Calculator', () => {
  it('renders spot cash calculations with 10% discount', () => {
    const plan = INITIAL_PLANS[0];
    const html = renderToString(<Calculator selectedPlan={plan} onProceedToEnrollment={() => {}} />);
    expect(html).toContain('Interactive Amortization Calculator');
    expect(html).toContain('Saved');
    expect(html).toContain('16,500');
    expect(html).toContain('10% Spot Cash Discount');
    expect(html).toContain('148,500');
  });

  it('renders term selectors', () => {
    const plan = INITIAL_PLANS[2];
    const html = renderToString(<Calculator selectedPlan={plan} onProceedToEnrollment={() => {}} />);
    expect(html).toContain('Spot Cash (-10%)');
    expect(html).toContain('Monthly (5 Yrs)');
    expect(html).toContain('Quarterly');
    expect(html).toContain('Semi-Annual');
    expect(html).toContain('Annual');
  });
});