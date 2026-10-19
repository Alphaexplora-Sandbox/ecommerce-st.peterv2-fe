import { useState } from 'react';

export function advanceInstallment(currentPaid: number, total: number = 60): { newCount: number; receiptRef: string } {
  const newCount = currentPaid >= total ? total : currentPaid + 1;
  const receiptRef = `OR-STP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  return { newCount, receiptRef };
}

export function executePayNext(
  paid: number,
  total: number,
  setPaid: (n: number) => void,
  setRef: (r: string) => void
): { newCount: number; receiptRef: string } {
  const { newCount, receiptRef } = advanceInstallment(paid, total);
  setPaid(newCount);
  setRef(receiptRef);
  return { newCount, receiptRef };
}

export function DashboardView({ initialPaid = 14, initialReceipt = null }: { initialPaid?: number; initialReceipt?: string | null }) {
  const [installmentsPaid, setInstallmentsPaid] = useState(initialPaid);
  const totalInstallments = 60;
  const monthlyAmortization = 1250;
  const [lastPaymentRef, setLastPaymentRef] = useState<string | null>(initialReceipt);

  const percentage = Math.round((installmentsPaid / totalInstallments) * 100);

  const handlePayNext = () => {
    executePayNext(installmentsPaid, totalInstallments, setInstallmentsPaid, setLastPaymentRef);
  };

  return (
    <section aria-labelledby="dashboard-title" style={{ maxWidth: '840px', margin: '0 auto', marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="dashboard-title" className="section-title">Planholder Self-Service Dashboard</h2>
          <p className="section-subtitle">
            Welcome back, Maria Santos (OFW Planholder) • Managing plans for family peace of mind
          </p>
        </div>
      </div>

      <div style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>St. Gregory (Hardwood Casket)</span>
              <span style={{ background: 'rgba(5, 150, 105, 0.2)', border: '1px solid #059669', color: '#6EE7B7', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                Active • In Good Standing
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Contract #<strong>STP-2026-88421</strong> • Planholder Assignee: <strong>Rosa Santos</strong> (Mother)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Monthly Due</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>₱{monthlyAmortization.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#E2E8F0' }}>
            <span>Amortization Progress: <strong>Month {installmentsPaid} of {totalInstallments} Paid</strong></span>
            <span style={{ fontWeight: 700, color: '#10B981' }}>{percentage}% Completed</span>
          </div>

          <div style={{ width: '100%', height: '12px', background: '#1E293B', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #D97706, #10B981)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#FCD34D', fontWeight: 600 }}>
              📅 Next Amortization of ₱{monthlyAmortization.toLocaleString()} Due on November 15, 2026
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              30-day grace period active through December 15, 2026
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
            onClick={handlePayNext}
          >
            Pay Next Installment (₱{monthlyAmortization.toLocaleString()}) →
          </button>
        </div>

        {lastPaymentRef && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(5, 150, 105, 0.15)', border: '1px solid #059669', borderRadius: '6px', fontSize: '0.85rem', color: '#6EE7B7' }}>
            ✓ Payment received! Official Receipt <strong>{lastPaymentRef}</strong> generated. Installment advanced to Month {installmentsPaid} of {totalInstallments}.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Full Anti-Inflation Lock</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Future funeral costs guaranteed covered regardless of inflation.</div>
        </div>
        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Transferability Rights</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Policy may be assigned or transferred to any living beneficiary.</div>
        </div>
        <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Accredited Chapels</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Honored in over 250 air-conditioned St. Peter chapels across the Philippines.</div>
        </div>
      </div>
    </section>
  );
}