import { renderToString } from 'react-dom/server';
import { PlanCatalog, INITIAL_PLANS } from '../../src/components/PlanCatalog';

describe('PlanCatalog', () => {
  it('renders all flagship plans in catalog', () => {
    const html = renderToString(<PlanCatalog onSelectPlan={() => {}} onEnrollPlan={() => {}} />);
    expect(html).toContain('St. George');
    expect(html).toContain('St. Bernadette');
    expect(html).toContain('St. Gregory');
    expect(html).toContain('St. Claire');
    expect(html).toContain('St. Jude');
    expect(html).toContain('St. James');
  });

  it('contains category and pricing details', () => {
    const html = renderToString(<PlanCatalog onSelectPlan={() => {}} onEnrollPlan={() => {}} />);
    expect(html).toContain('Casket');
    expect(html).toContain('Cremation');
    expect(html).toContain('165,000');
    expect(html).toContain('98,000');
    expect(html).toContain('Spot Cash');
  });

  it('has initial plans constant defined with 6 packages', () => {
    expect(INITIAL_PLANS.length).toBe(6);
    expect(INITIAL_PLANS[0].id).toBe('st-george');
    expect(INITIAL_PLANS[4].id).toBe('st-jude');
  });
});