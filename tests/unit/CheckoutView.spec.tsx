import { renderToString } from 'react-dom/server';
import { CheckoutView } from '../../src/components/CheckoutView';
import { INITIAL_PLANS } from '../../src/components/PlanCatalog';

describe('CheckoutView', () => {
  it('renders itemized invoice and counselor referral code', () => {
    const plan = INITIAL_PLANS[2];
    const html = renderToString(
      <CheckoutView
        selectedPlan={plan}
        paymentTerm="monthly"
        enrollmentData={{
          assigneeType: 'LovedOne',
          assigneeName: 'Rosa Santos',
          assigneeDob: '1962-06-14',
          beneficiaries: []
        }}
        onPaymentSuccess={() => {}}
      />
    );
    expect(html).toContain('Itemized Invoice Breakdown');
    expect(html).toContain('Verified Counselor: Jessica Bautista (Manila Central Branch)');
    expect(html).toContain('Initial Payment Due Today');
    expect(html).toContain('GCash');
    expect(html).toContain('Maya');
  });

  it('renders spot cash discount line item when spot cash is selected', () => {
    const plan = INITIAL_PLANS[0];
    const html = renderToString(
      <CheckoutView
        selectedPlan={plan}
        paymentTerm="spotcash"
        enrollmentData={null}
        onPaymentSuccess={() => {}}
      />
    );
    expect(html).toContain('Spot Cash 10% Discount');
    expect(html).toContain('16,500');
  });
});