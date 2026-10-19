import { useState } from 'react';
import type { Beneficiary, Plan } from '../types';
import { bindInput } from './handlers';

export function isAccreditedAgent(code: string): boolean {
  return code.trim().toUpperCase() === 'AGNT-7821-MNL';
}

export function calculateCheckoutSummary(basePrice: number, term: string): { discount: number; netPrice: number; initialDueToday: number } {
  const isSpotCash = term === 'spotcash';
  const discount = isSpotCash ? Math.round(basePrice * 0.10) : 0;
  const netPrice = basePrice - discount;
  const initialDueToday = isSpotCash ? netPrice : Math.round(basePrice / 60);
  return { discount, netPrice, initialDueToday };
}

export function executePayment(
  setIsProcessing: (b: boolean) => void,
  setCompleted: (c: string) => void,
  onPaymentSuccess: (c: string) => void,
  contractNum: string = 'STP-2026-88421'
): string {
  setIsProcessing(true);
  setCompleted(contractNum);
  onPaymentSuccess(contractNum);
  setIsProcessing(false);
  return contractNum;
}

export function createCheckoutStateHelpers(
  setAgentCode: (c: string) => void,
  setPaymentMethod: (m: 'GCash' | 'Maya' | 'Card' | 'BankTransfer') => void
) {
  return {
    updateAgent: (code: string) => setAgentCode(code),
    selectMethod: (method: 'GCash' | 'Maya' | 'Card' | 'BankTransfer') => setPaymentMethod(method)
  };
}

export interface CheckoutViewProps {
  selectedPlan: Plan;
  paymentTerm: string;
  enrollmentData: {
    assigneeType: string;
    assigneeName: string;
    assigneeDob: string;
    beneficiaries: Beneficiary[];
  } | null;
  onPaymentSuccess: (contractNumber: string) => void;
  initialCompletedContract?: string | null;
}

export function CheckoutView({ selectedPlan, paymentTerm, enrollmentData, onPaymentSuccess, initialCompletedContract = null }: CheckoutViewProps) {
  const [agentCode, setAgentCode] = useState('AGNT-7821-MNL');
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'Card' | 'BankTransfer'>('GCash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedContract, setCompletedContract] = useState<string | null>(initialCompletedContract);

  const isSpotCash = paymentTerm === 'spotcash';
  const { discount, initialDueToday } = calculateCheckoutSummary(selectedPlan.basePrice, paymentTerm);
  const isAgentVerified = isAccreditedAgent(agentCode);

  const helpers = createCheckoutStateHelpers(setAgentCode, setPaymentMethod);

  const handlePay = () => {
    executePayment(setIsProcessing, setCompletedContract, onPaymentSuccess);
  };

  if (completedContract) {
    return (
      <section aria-labelledby="confirmation-title" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', background: '#0F172A', border: '1px solid #059669', borderRadius: '12px', padding: '2.5rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(5, 150, 105, 0.2)', border: '2px solid #059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '2rem', color: '#10B981' }}>
          ✓
        </div>
        <h2 id="confirmation-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
          Policy Successfully Bound!
        </h2>
        <div style={{ fontSize: '1rem', color: '#F59E0B', fontWeight: 700, marginBottom: '1rem' }}>
          Official Contract #{completedContract}
        </div>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Congratulations! Your memorial plan for <strong>{enrollmentData?.assigneeName || 'Rosa Santos'}</strong> is now officially active.
          Your policy document and official BIR-compliant electronic receipt are available below.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="btn-outline"
            style={{ width: 'auto' }}
            onClick={() => alert('Downloading official Electronic Certificate of Life Plan (e-CLP)...')}
          >
            📄 Download e-Certificate of Life Plan (PDF)
          </button>
          <button
            type="button"
            className="btn-outline"
            style={{ width: 'auto' }}
            onClick={() => alert('Downloading official BIR-compliant Electronic Official Receipt (e-OR)...')}
          >
            🧾 Download Official Receipt (e-OR)
          </button>
        </div>

        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '6px', fontSize: '0.85rem', color: '#CBD5E1' }}>
          📱 SMS and email confirmations dispatched to your registered phone & email address.
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="checkout-title" style={{ maxWidth: '720px', margin: '0 auto', marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="checkout-title" className="section-title">E-Commerce Checkout & Payment</h2>
          <p className="section-subtitle">
            Secure multi-channel payment with zero hidden charges
          </p>
        </div>
      </div>

      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '1rem' }}>
            Itemized Invoice Breakdown
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#E2E8F0' }}>
            <span>{selectedPlan.name} ({selectedPlan.category} Plan)</span>
            <span>₱{selectedPlan.basePrice.toLocaleString()}</span>
          </div>

          {isSpotCash && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#10B981', fontWeight: 600 }}>
              <span>Spot Cash 10% Discount</span>
              <span>-₱{discount.toLocaleString()}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94A3B8' }}>
            <span>Payment Mode</span>
            <span style={{ textTransform: 'capitalize' }}>{paymentTerm}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94A3B8' }}>
            <span>Administrative & Processing Fee</span>
            <span style={{ color: '#10B981' }}>₱0.00 (Waived)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #334155', fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
            <span>Initial Payment Due Today</span>
            <span>₱{initialDueToday.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <label htmlFor="agent-code-input" className="form-label">Accredited Counselor Referral Code (Optional):</label>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              id="agent-code-input"
              type="text"
              className="form-input"
              value={agentCode}
              onChange={bindInput(helpers.updateAgent)}
              placeholder="e.g. AGNT-7821-MNL"
            />
          </div>
          {isAgentVerified ? (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>✓</span>
              <span>Verified Counselor: Jessica Bautista (Manila Central Branch)</span>
            </div>
          ) : agentCode.trim() ? (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              Agent code not recognized (optional field — you may continue without it)
            </div>
          ) : null}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Select Secure Payment Channel:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
            {(['GCash', 'Maya', 'Card', 'BankTransfer'] as const).map((method) => (
              <button
                key={method}
                type="button"
                className={`term-btn ${paymentMethod === method ? 'active' : ''}`}
                style={{ textAlign: 'center', padding: '0.75rem' }}
                onClick={() => helpers.selectMethod(method)}
              >
                {method === 'Card' ? 'Credit/Debit Card' : method}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', fontWeight: 700 }}
          onClick={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? 'Connecting to Payment Gateway...' : `Pay ₱${initialDueToday.toLocaleString()} via ${paymentMethod} →`}
        </button>
      </div>
    </section>
  );
}