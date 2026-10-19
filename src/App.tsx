import { useState } from 'react';
import type { Beneficiary, Plan } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PlanCatalog, INITIAL_PLANS } from './components/PlanCatalog';
import { Calculator } from './components/Calculator';
import { BeneficiaryForm } from './components/BeneficiaryForm';
import { CheckoutView } from './components/CheckoutView';
import { DashboardView } from './components/DashboardView';
import { ChapelLocator } from './components/ChapelLocator';
import { EBurolView } from './components/EBurolView';

export interface AppProps {
  title?: string;
  initialTab?: 'catalog' | 'calculator' | 'enrollment' | 'checkout' | 'dashboard' | 'chapels' | 'eburol';
}

export function createPlanHandlers(
  setSelectedPlan: (p: Plan) => void,
  setActiveTab: (t: 'catalog' | 'calculator' | 'enrollment' | 'checkout' | 'dashboard' | 'chapels' | 'eburol') => void,
  setPaymentTerm: (m: string) => void,
  setEnrollmentData: (d: { assigneeType: string; assigneeName: string; assigneeDob: string; beneficiaries: Beneficiary[]; } | null) => void
) {
  return {
    handleSelectPlan: (plan: Plan) => {
      setSelectedPlan(plan);
      setActiveTab('calculator');
    },
    handleEnrollPlan: (plan: Plan) => {
      setSelectedPlan(plan);
      setActiveTab('enrollment');
    },
    handleProceedToEnrollment: (plan: Plan, term: string) => {
      setSelectedPlan(plan);
      setPaymentTerm(term);
      setActiveTab('enrollment');
    },
    handleProceedToCheckout: (data: {
      assigneeType: string;
      assigneeName: string;
      assigneeDob: string;
      beneficiaries: Beneficiary[];
    }) => {
      setEnrollmentData(data);
      setActiveTab('checkout');
    },
    handlePaymentSuccess: () => {
      // Payment verified
    }
  };
}

export function App({ title = 'ecommerce-stpeterv2-frontend', initialTab = 'catalog' }: AppProps) {
  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(INITIAL_PLANS[2]);
  const [paymentTerm, setPaymentTerm] = useState('monthly');
  const [enrollmentData, setEnrollmentData] = useState<{
    assigneeType: string;
    assigneeName: string;
    assigneeDob: string;
    beneficiaries: Beneficiary[];
  } | null>(null);

  const {
    handleSelectPlan,
    handleEnrollPlan,
    handleProceedToEnrollment,
    handleProceedToCheckout,
    handlePaymentSuccess
  } = createPlanHandlers(setSelectedPlan, setActiveTab, setPaymentTerm, setEnrollmentData);

  return (
    <div className="st-peter-app">
      <Navbar
        title={title}
        activeTab={activeTab || 'catalog'}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
      />

      <main className="main-content">
        {activeTab === 'catalog' && (
          <>
            <HeroBanner onExploreClick={() => setActiveTab('calculator')} />
            <PlanCatalog
              onSelectPlan={handleSelectPlan}
              onEnrollPlan={handleEnrollPlan}
            />
          </>
        )}

        {activeTab === 'calculator' && (
          <Calculator
            selectedPlan={selectedPlan}
            onProceedToEnrollment={handleProceedToEnrollment}
          />
        )}

        {activeTab === 'enrollment' && (
          <BeneficiaryForm
            selectedPlan={selectedPlan}
            paymentTerm={paymentTerm}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            selectedPlan={selectedPlan}
            paymentTerm={paymentTerm}
            enrollmentData={enrollmentData}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {activeTab === 'dashboard' && <DashboardView />}

        {activeTab === 'chapels' && <ChapelLocator />}

        {activeTab === 'eburol' && <EBurolView />}
      </main>

      <footer className="footer">
        <p>© 2026 St. Peter Life Plan, Inc. & Chapels • Dignified Funeral & Cremation Services Nationwide</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
          Regulated by the Insurance Commission of the Philippines (R.A. 9829). Pre-need trust funds held in trust with major Philippine universal banks.
        </p>
      </footer>
    </div>
  );
}