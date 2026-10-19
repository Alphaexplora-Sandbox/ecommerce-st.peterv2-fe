import { useState } from 'react';
import type { Plan } from '../types';
import { INITIAL_PLANS } from './PlanCatalog';
import { bindSelect } from './handlers';

export type PaymentTerm = 'spotcash' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';

export interface AmortizationDetails {
  discount: number;
  netPrice: number;
  installmentAmount: number;
  installmentsCount: number;
  termLabel: string;
}

export function computeAmortization(basePrice: number, term: PaymentTerm): AmortizationDetails {
  let discount = 0;
  let netPrice = basePrice;
  let installmentAmount = 0;
  let installmentsCount = 1;
  let termLabel = '';

  switch (term) {
    case 'spotcash':
      discount = Math.round(basePrice * 0.10);
      netPrice = basePrice - discount;
      installmentAmount = netPrice;
      installmentsCount = 1;
      termLabel = 'One-time Spot Cash Payment';
      break;
    case 'annual':
      installmentsCount = 5;
      installmentAmount = Math.round(basePrice / 5);
      termLabel = '5 Annual Installments (1 per year)';
      break;
    case 'semiannual':
      installmentsCount = 10;
      installmentAmount = Math.round(basePrice / 10);
      termLabel = '10 Semi-Annual Installments (2 per year)';
      break;
    case 'quarterly':
      installmentsCount = 20;
      installmentAmount = Math.round(basePrice / 20);
      termLabel = '20 Quarterly Installments (4 per year)';
      break;
    case 'monthly':
      installmentsCount = 60;
      installmentAmount = Math.round(basePrice / 60);
      termLabel = '60 Monthly Installments (5 years)';
      break;
  }

  return { discount, netPrice, installmentAmount, installmentsCount, termLabel };
}

export function createCalculatorStateHelpers(
  setCurrentPlanId: (id: string) => void,
  setTerm: (t: PaymentTerm) => void
) {
  return {
    selectPlanId: (id: string) => setCurrentPlanId(id),
    selectTerm: (t: PaymentTerm) => setTerm(t)
  };
}

export interface CalculatorProps {
  selectedPlan: Plan;
  onProceedToEnrollment: (plan: Plan, term: string) => void;
}

export function Calculator({ selectedPlan, onProceedToEnrollment }: CalculatorProps) {
  const [currentPlanId, setCurrentPlanId] = useState(selectedPlan.id);
  const [term, setTerm] = useState<PaymentTerm>('spotcash');

  const plan = INITIAL_PLANS.find((p) => p.id === currentPlanId) || selectedPlan;
  const { discount, installmentAmount, installmentsCount, termLabel } = computeAmortization(plan.basePrice, term);
  const helpers = createCalculatorStateHelpers(setCurrentPlanId, setTerm);

  return (
    <section className="calc-container" aria-labelledby="calc-title">
      <div className="section-header">
        <div>
          <h2 id="calc-title" className="section-title">Interactive Amortization Calculator</h2>
          <p className="section-subtitle">
            Instant calculation across Spot Cash (10% discount) and 5-year installment modalities
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="plan-selector" className="form-label">Selected Memorial Plan:</label>
          <select
            id="plan-selector"
            className="form-select"
            value={currentPlanId}
            onChange={bindSelect(helpers.selectPlanId)}
          >
            {INITIAL_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category}) — ₱{p.basePrice.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Mode Selection:</label>
          <div className="term-selector" role="radiogroup" aria-label="Payment Term Options">
            {(['spotcash', 'monthly', 'quarterly', 'semiannual', 'annual'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`term-btn ${term === t ? 'active' : ''}`}
                onClick={() => helpers.selectTerm(t)}
              >
                {t === 'spotcash' ? 'Spot Cash (-10%)' : t === 'monthly' ? 'Monthly (5 Yrs)' : t === 'semiannual' ? 'Semi-Annual' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="calc-result-box">
        <div>
          <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{plan.name} • {termLabel}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
            ₱{installmentAmount.toLocaleString()}{' '}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: '#94A3B8' }}>
              {term === 'spotcash' ? 'net total' : `/ installment (${installmentsCount} total)`}
            </span>
          </div>

          {term === 'spotcash' ? (
            <div className="calc-savings-badge">
              ✓ Saved ₱{discount.toLocaleString()} with 10% Spot Cash Discount!
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.5rem' }}>
              Total Contract Price: ₱{plan.basePrice.toLocaleString()} (Zero interest, anti-inflationary lock-in)
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            onClick={() => onProceedToEnrollment(plan, term)}
          >
            Proceed to Enrollment with this Plan →
          </button>
        </div>
      </div>
    </section>
  );
}