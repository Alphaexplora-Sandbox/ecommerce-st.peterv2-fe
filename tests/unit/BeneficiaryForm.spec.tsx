import { renderToString } from 'react-dom/server';
import { BeneficiaryForm } from '../../src/components/BeneficiaryForm';
import { INITIAL_PLANS } from '../../src/components/PlanCatalog';

describe('BeneficiaryForm', () => {
  it('renders assignee and beneficiary fields with 100% initial allocation', () => {
    const plan = INITIAL_PLANS[2];
    const html = renderToString(
      <BeneficiaryForm selectedPlan={plan} paymentTerm="monthly" onProceedToCheckout={() => {}} />
    );
    expect(html).toContain('Planholder KYC &amp; Beneficiary Designation');
    expect(html).toContain('Total Allocated: 100% (Valid for legal policy issuance)');
    expect(html).toContain('Maria Santos');
    expect(html).toContain('Paolo Santos');
  });

  it('renders senior citizen rider notice when assignee is over 60', () => {
    const plan = INITIAL_PLANS[4];
    const html = renderToString(
      <BeneficiaryForm selectedPlan={plan} paymentTerm="spotcash" onProceedToCheckout={() => {}} />
    );
    expect(html).toContain('Insurance rider waived for planholders above age 60');
    expect(html).toContain('Philippine Passport');
    expect(html).toContain('Master Trust Terms and Conditions');
  });
});