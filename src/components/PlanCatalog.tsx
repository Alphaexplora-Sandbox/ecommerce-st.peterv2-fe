import { useState } from 'react';
import type { Plan } from '../types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'st-george',
    name: 'St. George',
    category: 'Casket',
    casketOrUrnType: 'Heavy metal casket, double lid, full viewing setup with brass appointments',
    basePrice: 165000,
    viewingDays: 4,
    hasReturnOfPremium: true,
    features: ['Double lid metal casket', '4-day air-conditioned viewing', '50km hearse perimeter', 'Return of Premium rider']
  },
  {
    id: 'st-bernadette',
    name: 'St. Bernadette',
    category: 'Casket',
    casketOrUrnType: 'Semi-metal casket, single lid, elegant chapel drapery and velvet interior',
    basePrice: 110000,
    viewingDays: 4,
    hasReturnOfPremium: true,
    features: ['Single lid semi-metal casket', '4-day air-conditioned viewing', '50km hearse perimeter', 'Return of Premium rider']
  },
  {
    id: 'st-gregory',
    name: 'St. Gregory',
    category: 'Casket',
    casketOrUrnType: 'Polished hardwood casket, sealed gloss finish, full ceremonial viewing',
    basePrice: 75000,
    viewingDays: 4,
    hasReturnOfPremium: true,
    features: ['Polished hardwood casket', '4-day air-conditioned viewing', 'Full embalming & cosmetics', 'Return of Premium rider']
  },
  {
    id: 'st-claire',
    name: 'St. Claire',
    category: 'Casket',
    casketOrUrnType: 'Fine wood casket with glass viewing cover, dignified simplicity',
    basePrice: 52000,
    viewingDays: 3,
    hasReturnOfPremium: false,
    features: ['Fine wood casket with glass cover', '3-day chapel viewing', 'Standard floral arrangement', 'Affordable dignity']
  },
  {
    id: 'st-jude',
    name: 'St. Jude',
    category: 'Cremation',
    casketOrUrnType: 'Cremation with 3-day chapel viewing, ceremonial cremation casket, and marble urn',
    basePrice: 98000,
    viewingDays: 3,
    hasReturnOfPremium: true,
    features: ['Ceremonial viewing casket included', '3-day chapel wake', 'Solid marble urn', 'Return of Premium rider']
  },
  {
    id: 'st-james',
    name: 'St. James',
    category: 'Cremation',
    casketOrUrnType: 'Direct cremation service, standard processing, and elegant marble urn',
    basePrice: 62000,
    viewingDays: 0,
    hasReturnOfPremium: false,
    features: ['Direct cremation service', 'Solid marble urn', 'Transfer to crematorium', 'Dignified urn handover']
  }
];

export function filterPlans(plans: Plan[], category: 'All' | 'Casket' | 'Cremation', budget: 'All' | 'Under60k' | '60kTo100k' | 'Over100k'): Plan[] {
  return plans.filter((plan) => {
    if (category !== 'All' && plan.category !== category) return false;
    if (budget === 'Under60k' && plan.basePrice >= 60000) return false;
    if (budget === '60kTo100k' && (plan.basePrice < 60000 || plan.basePrice > 100000)) return false;
    if (budget === 'Over100k' && plan.basePrice <= 100000) return false;
    return true;
  });
}

export function handleSelectPlanClick(plan: Plan, callback: (p: Plan) => void): Plan {
  callback(plan);
  return plan;
}

export function handleEnrollPlanClick(plan: Plan, callback: (p: Plan) => void): Plan {
  callback(plan);
  return plan;
}

export function createCatalogFilterHelpers(
  setCategoryFilter: (c: 'All' | 'Casket' | 'Cremation') => void,
  setBudgetFilter: (b: 'All' | 'Under60k' | '60kTo100k' | 'Over100k') => void,
  setShowComparison: React.Dispatch<React.SetStateAction<boolean>>
) {
  return {
    selectCategory: (c: 'All' | 'Casket' | 'Cremation') => setCategoryFilter(c),
    selectBudget: (b: 'All' | 'Under60k' | '60kTo100k' | 'Over100k') => setBudgetFilter(b),
    toggleComparison: () => setShowComparison((prev) => !prev)
  };
}

export interface PlanCatalogProps {
  onSelectPlan: (plan: Plan) => void;
  onEnrollPlan: (plan: Plan) => void;
  initialShowComparison?: boolean;
}

export function PlanCatalog({ onSelectPlan, onEnrollPlan, initialShowComparison = false }: PlanCatalogProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Casket' | 'Cremation'>('All');
  const [budgetFilter, setBudgetFilter] = useState<'All' | 'Under60k' | '60kTo100k' | 'Over100k'>('All');
  const [showComparison, setShowComparison] = useState(initialShowComparison);

  const filteredPlans = filterPlans(INITIAL_PLANS, categoryFilter, budgetFilter);
  const helpers = createCatalogFilterHelpers(setCategoryFilter, setBudgetFilter, setShowComparison);

  return (
    <section aria-labelledby="catalog-heading" style={{ marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="catalog-heading" className="section-title">Flagship Memorial Plans Catalog</h2>
          <p className="section-subtitle">
            Transparent inclusions, guaranteed funeral service, and anti-inflationary pricing
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn-outline"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            onClick={helpers.toggleComparison}
          >
            {showComparison ? 'Hide Side-by-Side Matrix' : 'Compare Packages Side-by-Side'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['All', 'Casket', 'Cremation'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`nav-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => helpers.selectCategory(cat)}
            >
              {cat === 'All' ? 'All Packages' : cat === 'Casket' ? 'Casket Burial Plans' : 'Cremation Packages'}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="budget-filter-select" style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
            Budget:
          </label>
          <select
            id="budget-filter-select"
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
            value={budgetFilter}
            onChange={(e) => helpers.selectBudget(e.target.value as typeof budgetFilter)}
          >
            <option value="All">All Price Tiers</option>
            <option value="Under60k">Under ₱60,000</option>
            <option value="60kTo100k">₱60,000 - ₱100,000</option>
            <option value="Over100k">₱100,000 and above</option>
          </select>
        </div>
      </div>

      {showComparison && (
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem', marginBottom: '2rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
            Package Comparison Matrix
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #475569', color: '#D97706', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Plan Name</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Contract Price</th>
                <th style={{ padding: '0.75rem' }}>Spot Cash (-10%)</th>
                <th style={{ padding: '0.75rem' }}>Chapel Viewing</th>
                <th style={{ padding: '0.75rem' }}>Hearse / Urn</th>
                <th style={{ padding: '0.75rem' }}>Return of Premium</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_PLANS.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#FFFFFF' }}>{p.name}</td>
                  <td style={{ padding: '0.75rem', color: '#94A3B8' }}>{p.category}</td>
                  <td style={{ padding: '0.75rem', color: '#F59E0B' }}>₱{p.basePrice.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', color: '#059669', fontWeight: 600 }}>₱{(p.basePrice * 0.9).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>{p.viewingDays > 0 ? `${p.viewingDays} Days` : 'Direct Cremation'}</td>
                  <td style={{ padding: '0.75rem' }}>{p.category === 'Casket' ? '50 km Radius' : 'Solid Marble Urn'}</td>
                  <td style={{ padding: '0.75rem', color: p.hasReturnOfPremium ? '#059669' : '#94A3B8' }}>
                    {p.hasReturnOfPremium ? '✓ Included' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="catalog-grid">
        {filteredPlans.map((plan) => {
          const spotCashPrice = plan.basePrice * 0.9;
          const monthlyPrice = Math.round(plan.basePrice / 60);

          return (
            <article key={plan.id} className="plan-card">
              <span className="plan-badge">{plan.category} Plan</span>
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-type">{plan.casketOrUrnType}</p>

              <div className="plan-pricing">
                <div className="plan-price-label">Contract Price</div>
                <div className="plan-price-value">₱{plan.basePrice.toLocaleString()}</div>
                <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
                  Spot Cash: ₱{spotCashPrice.toLocaleString()} (Save ₱{(plan.basePrice * 0.1).toLocaleString()})
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                  or ₱{monthlyPrice.toLocaleString()}/mo for 5 years
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="plan-feature-item">
                    <span style={{ color: '#059669' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => handleSelectPlanClick(plan, onSelectPlan)}
                >
                  Calculate Terms
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleEnrollPlanClick(plan, onEnrollPlan)}
                >
                  Enroll Now
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}