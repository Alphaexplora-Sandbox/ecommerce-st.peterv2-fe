import { useState } from 'react';
import type { Beneficiary, Plan } from '../types';

export function calculateAge(dobString: string, currentYear: number = new Date().getFullYear()): number {
  const birthYear = new Date(dobString).getFullYear();
  return isNaN(birthYear) ? 30 : currentYear - birthYear;
}

export function validateBeneficiaryAllocation(beneficiaries: Beneficiary[]): { total: number; isValid: boolean } {
  const total = beneficiaries
    .filter((b) => b.isPrimary)
    .reduce((sum, b) => sum + (Number(b.percentageShare) || 0), 0);
  return { total, isValid: total === 100 };
}

export function addBeneficiaryItem(list: Beneficiary[], newId: string = String(Date.now())): Beneficiary[] {
  return [
    ...list,
    { id: newId, fullName: '', relationship: 'Relative', percentageShare: 0, isPrimary: true }
  ];
}

export function removeBeneficiaryItem(list: Beneficiary[], id: string): Beneficiary[] {
  if (list.length <= 1) return list;
  return list.filter((b) => b.id !== id);
}

export function updateBeneficiaryItem(
  list: Beneficiary[],
  id: string,
  field: keyof Beneficiary,
  value: string | number
): Beneficiary[] {
  return list.map((b) => (b.id === id ? { ...b, [field]: value } : b));
}

export function submitBeneficiaryForm(
  isAllocationValid: boolean,
  signedAgreement: boolean,
  data: {
    assigneeType: string;
    assigneeName: string;
    assigneeDob: string;
    beneficiaries: Beneficiary[];
  },
  callback: (d: { assigneeType: string; assigneeName: string; assigneeDob: string; beneficiaries: Beneficiary[] }) => void
): boolean {
  if (!isAllocationValid || !signedAgreement) return false;
  callback(data);
  return true;
}

export function createEnrollmentFormStateHelpers(
  setAssigneeType: (t: 'Self' | 'LovedOne') => void,
  setAssigneeName: (n: string) => void,
  setRelationship: (r: string) => void,
  setAssigneeDob: (d: string) => void,
  setIdType: (t: string) => void,
  setSignedAgreement: (s: boolean) => void,
  setSignatureName: (n: string) => void
) {
  return {
    selectSelf: () => { setAssigneeType('Self'); setAssigneeName('Maria Santos'); setRelationship('Self'); },
    selectLovedOne: () => { setAssigneeType('LovedOne'); setAssigneeName('Rosa Santos'); setRelationship('Mother'); },
    updateDob: (dob: string) => setAssigneeDob(dob),
    updateRelationship: (rel: string) => setRelationship(rel),
    updateIdType: (id: string) => setIdType(id),
    toggleAgreement: (agreed: boolean) => setSignedAgreement(agreed),
    updateSignature: (sig: string) => setSignatureName(sig)
  };
}

export function createBeneficiaryItemHelpers(
  beneficiaries: Beneficiary[],
  setBeneficiaries: (b: Beneficiary[]) => void
) {
  return {
    handleAdd: () => setBeneficiaries(addBeneficiaryItem(beneficiaries)),
    handleRemove: (id: string) => setBeneficiaries(removeBeneficiaryItem(beneficiaries, id)),
    handleUpdate: (id: string, field: keyof Beneficiary, val: string | number) =>
      setBeneficiaries(updateBeneficiaryItem(beneficiaries, id, field, val))
  };
}

export interface BeneficiaryFormProps {
  selectedPlan: Plan;
  paymentTerm: string;
  onProceedToCheckout: (data: {
    assigneeType: string;
    assigneeName: string;
    assigneeDob: string;
    beneficiaries: Beneficiary[];
  }) => void;
  initialAssigneeType?: 'Self' | 'LovedOne';
  initialBeneficiaries?: Beneficiary[];
  initialSignedAgreement?: boolean;
}

export function BeneficiaryForm({
  selectedPlan,
  paymentTerm,
  onProceedToCheckout,
  initialAssigneeType = 'LovedOne',
  initialBeneficiaries,
  initialSignedAgreement = false
}: BeneficiaryFormProps) {
  const [assigneeType, setAssigneeType] = useState<'Self' | 'LovedOne'>(initialAssigneeType);
  const [assigneeName, setAssigneeName] = useState('Rosa Santos');
  const [assigneeDob, setAssigneeDob] = useState('1962-06-14');
  const [relationship, setRelationship] = useState('Mother');

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(
    initialBeneficiaries || [
      { id: '1', fullName: 'Maria Santos', relationship: 'Daughter', birthDate: '1990-04-12', percentageShare: 70, isPrimary: true },
      { id: '2', fullName: 'Paolo Santos', relationship: 'Son', birthDate: '1994-08-25', percentageShare: 30, isPrimary: true }
    ]
  );

  const [idType, setIdType] = useState('Philippine Passport');
  const [signedAgreement, setSignedAgreement] = useState(initialSignedAgreement);
  const [signatureName, setSignatureName] = useState('');

  const age = calculateAge(assigneeDob);
  const isSenior = age > 60;
  const { total: totalPercentage, isValid: isAllocationValid } = validateBeneficiaryAllocation(beneficiaries);

  const helpers = createEnrollmentFormStateHelpers(
    setAssigneeType,
    setAssigneeName,
    setRelationship,
    setAssigneeDob,
    setIdType,
    setSignedAgreement,
    setSignatureName
  );

  const itemHelpers = createBeneficiaryItemHelpers(beneficiaries, setBeneficiaries);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBeneficiaryForm(isAllocationValid, signedAgreement, {
      assigneeType,
      assigneeName,
      assigneeDob,
      beneficiaries
    }, onProceedToCheckout);
  };

  return (
    <section aria-labelledby="enrollment-title" style={{ maxWidth: '840px', margin: '0 auto', marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div>
          <h2 id="enrollment-title" className="section-title">Planholder KYC & Beneficiary Designation</h2>
          <p className="section-subtitle">
            Enrolling in {selectedPlan.name} ({paymentTerm}) — Legal policyholder registration and Insurance Commission compliance
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#0F172A', border: '1px solid #334155', borderRadius: '12px', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
            1. Plan Ownership & Assignee
          </h3>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`term-btn ${assigneeType === 'Self' ? 'active' : ''}`}
              onClick={helpers.selectSelf}
            >
              Buying for Myself (Principal)
            </button>
            <button
              type="button"
              className={`term-btn ${assigneeType === 'LovedOne' ? 'active' : ''}`}
              onClick={helpers.selectLovedOne}
            >
              Buying for a Loved One (Designated Assignee)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="assignee-name-input" className="form-label">Full Legal Name:</label>
              <input
                id="assignee-name-input"
                type="text"
                className="form-input"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignee-dob-input" className="form-label">Date of Birth:</label>
              <input
                id="assignee-dob-input"
                type="date"
                className="form-input"
                value={assigneeDob}
                onChange={(e) => helpers.updateDob(e.target.value)}
                required
              />
            </div>

            {assigneeType === 'LovedOne' && (
              <div className="form-group">
                <label htmlFor="assignee-rel-input" className="form-label">Relationship to Buyer:</label>
                <input
                  id="assignee-rel-input"
                  type="text"
                  className="form-input"
                  value={relationship}
                  onChange={(e) => helpers.updateRelationship(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              marginTop: '0.75rem',
              background: isSenior ? 'rgba(217, 119, 6, 0.15)' : 'rgba(5, 150, 105, 0.15)',
              border: `1px solid ${isSenior ? '#D97706' : '#059669'}`,
              fontSize: '0.85rem',
              color: isSenior ? '#FCD34D' : '#6EE7B7'
            }}
          >
            {isSenior ? (
              <span>ℹ️ Guaranteed Memorial Service active. Insurance rider waived for planholders above age 60 (Assignee is {age} years old).</span>
            ) : (
              <span>✓ Planholder is {age} years old: Full Life Insurance Rider and Accidental Death coverage active.</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
              2. Primary Beneficiaries (Must Equal Exactly 100%)
            </h3>
            <button
              type="button"
              className="btn-outline"
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              onClick={itemHelpers.handleAdd}
            >
              + Add Beneficiary
            </button>
          </div>

          {beneficiaries.map((b, index) => (
            <div
              key={b.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr auto',
                gap: '0.75rem',
                alignItems: 'center',
                marginBottom: '0.75rem',
                background: '#1E293B',
                padding: '0.75rem',
                borderRadius: '6px'
              }}
            >
              <div>
                <label htmlFor={`ben-name-${b.id}`} style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Full Name:</label>
                <input
                  id={`ben-name-${b.id}`}
                  type="text"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem' }}
                  value={b.fullName}
                  onChange={(e) => itemHelpers.handleUpdate(b.id, 'fullName', e.target.value)}
                  placeholder="e.g. Maria Santos"
                  required
                />
              </div>

              <div>
                <label htmlFor={`ben-rel-${b.id}`} style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Relationship:</label>
                <input
                  id={`ben-rel-${b.id}`}
                  type="text"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem' }}
                  value={b.relationship}
                  onChange={(e) => itemHelpers.handleUpdate(b.id, 'relationship', e.target.value)}
                  placeholder="e.g. Daughter"
                  required
                />
              </div>

              <div>
                <label htmlFor={`ben-pct-${b.id}`} style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Share (%):</label>
                <input
                  id={`ben-pct-${b.id}`}
                  type="number"
                  min="1"
                  max="100"
                  className="form-input"
                  style={{ padding: '0.4rem 0.6rem' }}
                  value={b.percentageShare}
                  onChange={(e) => itemHelpers.handleUpdate(b.id, 'percentageShare', Number(e.target.value))}
                  required
                />
              </div>

              {beneficiaries.length > 1 && (
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.5rem', marginTop: '1rem' }}
                  onClick={() => itemHelpers.handleRemove(b.id)}
                  aria-label={`Remove beneficiary ${index + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            {isAllocationValid ? (
              <div style={{ background: 'rgba(5, 150, 105, 0.2)', border: '1px solid #059669', color: '#6EE7B7', padding: '0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                ✓ Total Allocated: 100% (Valid for legal policy issuance)
              </div>
            ) : (
              <div style={{ background: 'rgba(220, 38, 38, 0.2)', border: '1px solid #DC2626', color: '#FCA5A5', padding: '0.75rem', borderRadius: '6px', fontWeight: 600 }}>
                ⚠️ Total percentage is {totalPercentage}%. Please adjust so total equals exactly 100%.
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1E293B' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
            3. Government Identity Verification (KYC)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div className="form-group">
              <label htmlFor="gov-id-select" className="form-label">Select Valid ID Type:</label>
              <select
                id="gov-id-select"
                className="form-select"
                value={idType}
                onChange={(e) => helpers.updateIdType(e.target.value)}
              >
                <option value="Philippine Passport">Philippine Passport (DFA)</option>
                <option value="PhilSys National ID">PhilSys National ID</option>
                <option value="UMID">Unified Multi-Purpose ID (UMID)</option>
                <option value="Senior Citizen ID">Senior Citizen ID</option>
                <option value="Drivers License">LTO Driver&apos;s License</option>
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">Upload Status:</span>
              <div style={{ background: '#1E293B', border: '1px dashed #059669', padding: '0.65rem 1rem', borderRadius: '6px', fontSize: '0.85rem', color: '#6EE7B7' }}>
                ✓ {idType} verified & attached (Max 5MB JPG/PNG/PDF)
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 700 }}>
            4. Digital Agreement & Master Trust Acceptance
          </h3>
          <div style={{ background: '#1E293B', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', color: '#94A3B8', maxHeight: '100px', overflowY: 'auto', marginBottom: '1rem' }}>
            By enrolling, the buyer certifies that all declarations herein are true and correct according to the best of their knowledge.
            The pre-need trust fund is maintained in compliance with the Insurance Commission (R.A. 9829). All benefits and service delivery
            are guaranteed by St. Peter Life Plan, Inc. across all accredited chapels nationwide.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              id="agreement-checkbox"
              type="checkbox"
              checked={signedAgreement}
              onChange={(e) => helpers.toggleAgreement(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
              required
            />
            <label htmlFor="agreement-checkbox" style={{ fontSize: '0.875rem', color: '#FFFFFF', cursor: 'pointer' }}>
              I have read and agree to the St. Peter Master Trust Terms and Conditions.
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="signature-input" className="form-label">Type Legal Name to Sign:</label>
            <input
              id="signature-input"
              type="text"
              className="form-input"
              value={signatureName}
              onChange={(e) => helpers.updateSignature(e.target.value)}
              placeholder="e.g. Maria Santos"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          disabled={!isAllocationValid || !signedAgreement || !signatureName.trim()}
        >
          {isAllocationValid ? 'Proceed to Payment Checkout →' : 'Correct Beneficiary Percentage (Must Equal 100%)'}
        </button>
      </form>
    </section>
  );
}