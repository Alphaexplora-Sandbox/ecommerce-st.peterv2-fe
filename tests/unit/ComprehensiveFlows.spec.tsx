import { renderToString } from 'react-dom/server';
import type { Beneficiary, Plan, Tribute } from '../../src/types';
import { handleTabSelection, NAV_TABS } from '../../src/components/Navbar';
import { createPlanHandlers } from '../../src/App';
import { computeAmortization, createCalculatorStateHelpers, PaymentTerm } from '../../src/components/Calculator';
import {
  calculateAge,
  validateBeneficiaryAllocation,
  addBeneficiaryItem,
  removeBeneficiaryItem,
  updateBeneficiaryItem,
  submitBeneficiaryForm,
  createEnrollmentFormStateHelpers,
  createBeneficiaryItemHelpers,
  BeneficiaryForm
} from '../../src/components/BeneficiaryForm';
import {
  isAccreditedAgent,
  calculateCheckoutSummary,
  executePayment,
  createCheckoutStateHelpers,
  CheckoutView
} from '../../src/components/CheckoutView';
import { advanceInstallment, executePayNext, DashboardView } from '../../src/components/DashboardView';
import {
  verifyFamilyPin,
  buildTribute,
  handleVerifyPinAction,
  handleLightCandleAction,
  handleAddTributeAction,
  createEBurolEventHandlers,
  createEBurolStateHelpers,
  EBurolView
} from '../../src/components/EBurolView';
import {
  filterPlans,
  INITIAL_PLANS,
  handleSelectPlanClick,
  handleEnrollPlanClick,
  createCatalogFilterHelpers,
  PlanCatalog
} from '../../src/components/PlanCatalog';
import { filterChapelsList, INITIAL_CHAPELS } from '../../src/components/ChapelLocator';

describe('Exhaustive Logic & Branch Coverage', () => {
  describe('App plan handlers', () => {
    it('executes all state change handlers in App', () => {
      let selected: Plan | null = null;
      let activeTab: string = '';
      let term: string = '';
      let enrollment: { assigneeType: string; assigneeName: string; assigneeDob: string; beneficiaries: Beneficiary[]; } | null = null;

      const handlers = createPlanHandlers(
        (p) => { selected = p; },
        (t) => { activeTab = t; },
        (m) => { term = m; },
        (d) => { enrollment = d; }
      );

      const plan = INITIAL_PLANS[0];
      handlers.handleSelectPlan(plan);
      expect(selected).toBe(plan);
      expect(activeTab).toBe('calculator');

      handlers.handleEnrollPlan(plan);
      expect(activeTab).toBe('enrollment');

      handlers.handleProceedToEnrollment(plan, 'quarterly');
      expect(term).toBe('quarterly');
      expect(activeTab).toBe('enrollment');

      handlers.handleProceedToCheckout({
        assigneeType: 'Self',
        assigneeName: 'Maria',
        assigneeDob: '1990-01-01',
        beneficiaries: []
      });
      expect((enrollment as { assigneeName: string } | null)?.assigneeName).toBe('Maria');
      expect(activeTab).toBe('checkout');

      handlers.handlePaymentSuccess();
    });
  });

  describe('Navbar handleTabSelection and NAV_TABS', () => {
    it('dispatches all tabs correctly', () => {
      expect(NAV_TABS.length).toBe(7);
      NAV_TABS.forEach((tab) => {
        let called = '';
        const res = handleTabSelection(tab.id, (t) => { called = t; });
        expect(res).toBe(tab.id);
        expect(called).toBe(tab.id);
      });
    });
  });

  describe('computeAmortization & Calculator helpers', () => {
    it('calculates spotcash with 10% discount', () => {
      const res = computeAmortization(100000, 'spotcash');
      expect(res.discount).toBe(10000);
      expect(res.netPrice).toBe(90000);
      expect(res.installmentAmount).toBe(90000);
      expect(res.installmentsCount).toBe(1);
    });

    it('calculates annual installment (5 installments)', () => {
      const res = computeAmortization(100000, 'annual');
      expect(res.discount).toBe(0);
      expect(res.installmentAmount).toBe(20000);
      expect(res.installmentsCount).toBe(5);
    });

    it('calculates semiannual installment (10 installments)', () => {
      const res = computeAmortization(100000, 'semiannual');
      expect(res.installmentAmount).toBe(10000);
      expect(res.installmentsCount).toBe(10);
    });

    it('calculates quarterly installment (20 installments)', () => {
      const res = computeAmortization(100000, 'quarterly');
      expect(res.installmentAmount).toBe(5000);
      expect(res.installmentsCount).toBe(20);
    });

    it('calculates monthly installment (60 installments)', () => {
      const res = computeAmortization(60000, 'monthly');
      expect(res.installmentAmount).toBe(1000);
      expect(res.installmentsCount).toBe(60);
    });

    it('executes createCalculatorStateHelpers', () => {
      let planId = '';
      let term: PaymentTerm = 'spotcash';
      const helpers = createCalculatorStateHelpers((id) => { planId = id; }, (t) => { term = t; });
      helpers.selectPlanId('st-jude');
      expect(planId).toBe('st-jude');
      helpers.selectTerm('monthly');
      expect(term).toBe('monthly');
    });
  });

  describe('BeneficiaryForm component states & helpers', () => {
    it('calculates age correctly', () => {
      expect(calculateAge('1990-01-01', 2026)).toBe(36);
      expect(calculateAge('1960-01-01', 2026)).toBe(66);
      expect(calculateAge('invalid-date', 2026)).toBe(30);
    });

    it('validates beneficiary allocation totals', () => {
      const valid: Beneficiary[] = [
        { id: '1', fullName: 'A', relationship: 'Son', percentageShare: 60, isPrimary: true },
        { id: '2', fullName: 'B', relationship: 'Daughter', percentageShare: 40, isPrimary: true },
        { id: '3', fullName: 'C', relationship: 'Contingent', percentageShare: 100, isPrimary: false }
      ];
      expect(validateBeneficiaryAllocation(valid)).toEqual({ total: 100, isValid: true });

      const invalid: Beneficiary[] = [
        { id: '1', fullName: 'A', relationship: 'Son', percentageShare: 70, isPrimary: true },
        { id: '2', fullName: 'B', relationship: 'Daughter', percentageShare: 40, isPrimary: true }
      ];
      expect(validateBeneficiaryAllocation(invalid)).toEqual({ total: 110, isValid: false });

      const empty: Beneficiary[] = [];
      expect(validateBeneficiaryAllocation(empty)).toEqual({ total: 0, isValid: false });
    });

    it('adds, removes, and updates beneficiary items', () => {
      const initial: Beneficiary[] = [
        { id: '1', fullName: 'First', relationship: 'Son', percentageShare: 100, isPrimary: true }
      ];

      const withAdded = addBeneficiaryItem(initial, '2');
      expect(withAdded.length).toBe(2);
      expect(withAdded[1].id).toBe('2');

      const updated = updateBeneficiaryItem(withAdded, '2', 'fullName', 'Second');
      expect(updated[1].fullName).toBe('Second');

      const withRemoved = removeBeneficiaryItem(updated, '2');
      expect(withRemoved.length).toBe(1);

      const cantRemoveLast = removeBeneficiaryItem(withRemoved, '1');
      expect(cantRemoveLast.length).toBe(1);
    });

    it('executes createEnrollmentFormStateHelpers and createBeneficiaryItemHelpers', () => {
      let type = '';
      let name = '';
      let rel = '';
      let dob = '';
      let idType = '';
      let agree = false;
      let sig = '';

      const helpers = createEnrollmentFormStateHelpers(
        (t) => { type = t; },
        (n) => { name = n; },
        (r) => { rel = r; },
        (d) => { dob = d; },
        (id) => { idType = id; },
        (a) => { agree = a; },
        (s) => { sig = s; }
      );

      helpers.selectSelf();
      expect(type).toBe('Self');
      expect(name).toBe('Maria Santos');

      helpers.selectLovedOne();
      expect(type).toBe('LovedOne');
      expect(name).toBe('Rosa Santos');

      helpers.updateDob('1970-05-05');
      expect(dob).toBe('1970-05-05');

      helpers.updateRelationship('Sister');
      expect(rel).toBe('Sister');

      helpers.updateIdType('PhilSys');
      expect(idType).toBe('PhilSys');

      helpers.toggleAgreement(true);
      expect(agree).toBe(true);

      helpers.updateSignature('Signer Name');
      expect(sig).toBe('Signer Name');

      let bens: Beneficiary[] = [{ id: '1', fullName: 'Test', relationship: 'Son', percentageShare: 100, isPrimary: true }];
      const itemHelpers = createBeneficiaryItemHelpers(bens, (b) => { bens = b; });
      itemHelpers.handleAdd();
      expect(bens.length).toBe(2);
      itemHelpers.handleUpdate('1', 'fullName', 'Updated');
      expect(bens[0].fullName).toBe('Updated');
      itemHelpers.handleRemove('1');
      expect(bens.length).toBe(1);
    });

    it('submits form only when valid and signed', () => {
      let submittedData: { assigneeName: string } | null = null;
      const callback = (d: { assigneeType: string; assigneeName: string; assigneeDob: string; beneficiaries: Beneficiary[]; }) => { submittedData = d; };

      const dummy = { assigneeType: 'Self', assigneeName: 'M', assigneeDob: '1990-01-01', beneficiaries: [] };
      expect(submitBeneficiaryForm(false, true, dummy, callback)).toBe(false);
      expect(submitBeneficiaryForm(true, false, dummy, callback)).toBe(false);
      expect(submitBeneficiaryForm(true, true, dummy, callback)).toBe(true);
      expect((submittedData as { assigneeName: string } | null)?.assigneeName).toBe('M');
    });

    it('renders invalid percentage warning banner when sum is not 100', () => {
      const invalidBens: Beneficiary[] = [
        { id: '1', fullName: 'A', relationship: 'Son', percentageShare: 70, isPrimary: true },
        { id: '2', fullName: 'B', relationship: 'Daughter', percentageShare: 40, isPrimary: true }
      ];
      const html = renderToString(
        <BeneficiaryForm
          selectedPlan={INITIAL_PLANS[0]}
          paymentTerm="monthly"
          onProceedToCheckout={() => {}}
          initialBeneficiaries={invalidBens}
          initialAssigneeType="Self"
        />
      );
      expect(html).toContain('Total percentage is');
      expect(html).toContain('110');
    });
  });

  describe('CheckoutView completed contract & helpers', () => {
    it('validates accredited agent codes', () => {
      expect(isAccreditedAgent('AGNT-7821-MNL')).toBe(true);
      expect(isAccreditedAgent('agnt-7821-mnl ')).toBe(true);
      expect(isAccreditedAgent('UNKNOWN')).toBe(false);
    });

    it('calculates checkout summary for spotcash and installment', () => {
      const spot = calculateCheckoutSummary(100000, 'spotcash');
      expect(spot.discount).toBe(10000);
      expect(spot.netPrice).toBe(90000);
      expect(spot.initialDueToday).toBe(90000);

      const monthly = calculateCheckoutSummary(60000, 'monthly');
      expect(monthly.discount).toBe(0);
      expect(monthly.netPrice).toBe(60000);
      expect(monthly.initialDueToday).toBe(1000);
    });

    it('executes checkout state helpers and payment', () => {
      let code = '';
      let method: 'GCash' | 'Maya' | 'Card' | 'BankTransfer' = 'GCash';
      const helpers = createCheckoutStateHelpers((c) => { code = c; }, (m) => { method = m; });
      helpers.updateAgent('AGNT-7821-MNL');
      expect(code).toBe('AGNT-7821-MNL');
      helpers.selectMethod('Maya');
      expect(method).toBe('Maya');

      let isProc = false;
      let completed = '';
      let successContract = '';
      const contract = executePayment(
        (b) => { isProc = b; },
        (c) => { completed = c; },
        (c) => { successContract = c; }
      );
      expect(contract).toBe('STP-2026-88421');
      expect(completed).toBe('STP-2026-88421');
      expect(successContract).toBe('STP-2026-88421');
      expect(isProc).toBe(false);
    });

    it('renders completed contract confirmation screen', () => {
      const html = renderToString(
        <CheckoutView
          selectedPlan={INITIAL_PLANS[0]}
          paymentTerm="monthly"
          enrollmentData={{
            assigneeType: 'LovedOne',
            assigneeName: 'Rosa Santos',
            assigneeDob: '1962-06-14',
            beneficiaries: []
          }}
          onPaymentSuccess={() => {}}
          initialCompletedContract="STP-2026-88421"
        />
      );
      expect(html).toContain('Policy Successfully Bound!');
      expect(html).toContain('Official Contract');
      expect(html).toContain('STP-2026-88421');
    });
  });

  describe('DashboardView helpers', () => {
    it('advances installment count and generates receipt', () => {
      const res = advanceInstallment(14, 60);
      expect(res.newCount).toBe(15);
      expect(res.receiptRef).toContain('OR-STP-');

      const cap = advanceInstallment(60, 60);
      expect(cap.newCount).toBe(60);
    });

    it('executes executePayNext action', () => {
      let current = 14;
      let ref = '';
      const res = executePayNext(current, 60, (n) => { current = n; }, (r) => { ref = r; });
      expect(res.newCount).toBe(15);
      expect(current).toBe(15);
      expect(ref).toContain('OR-STP-');
    });

    it('renders with initial receipt reference', () => {
      const html = renderToString(<DashboardView initialPaid={15} initialReceipt="OR-STP-TEST1234" />);
      expect(html).toContain('OR-STP-TEST1234');
      expect(html).toContain('15');
      expect(html).toContain('60');
    });
  });

  describe('EBurolView PIN access gate & helpers', () => {
    it('verifies family PIN', () => {
      expect(verifyFamilyPin('882194')).toBe(true);
      expect(verifyFamilyPin(' 882194 ')).toBe(true);
      expect(verifyFamilyPin('000000')).toBe(false);
    });

    it('executes createEBurolStateHelpers and createEBurolEventHandlers', () => {
      let pin = '';
      let sender = '';
      let rel = '';
      let msg = '';
      const helpers = createEBurolStateHelpers(
        (p) => { pin = p; },
        (s) => { sender = s; },
        (r) => { rel = r; },
        (m) => { msg = m; }
      );
      helpers.updatePin('123456');
      expect(pin).toBe('123456');
      helpers.updateSender('Name');
      expect(sender).toBe('Name');
      helpers.updateRel('Rel');
      expect(rel).toBe('Rel');
      helpers.updateMsg('Msg');
      expect(msg).toBe('Msg');

      let isAuth = false;
      let pinErr: string | null = null;
      let candleCount = 0;
      let isLit = false;
      let tributes: Tribute[] = [];
      let formReset = false;

      const evts = createEBurolEventHandlers(
        '882194',
        (a) => { isAuth = a; },
        (e) => { pinErr = e; },
        (fn) => { candleCount = typeof fn === 'function' ? fn(candleCount) : fn; return candleCount; },
        (l) => { isLit = l; },
        'Sender',
        'Rel',
        'Message',
        tributes,
        (t) => { tributes = t; },
        () => { formReset = true; }
      );

      const fakeEvt = { preventDefault: () => {} };
      expect(evts.onVerifySubmit(fakeEvt)).toBe(true);
      expect(isAuth).toBe(true);
      expect(pinErr).toBe(null);

      evts.onCandleClick();
      expect(isLit).toBe(true);
      expect(candleCount).toBe(1);

      expect(evts.onTributeSubmit(fakeEvt)).toBe(true);
      expect(tributes.length).toBe(1);
      expect(formReset).toBe(true);
    });

    it('executes handleVerifyPinAction', () => {
      let auth = false;
      let err: string | null = null;
      expect(handleVerifyPinAction('882194', (a) => { auth = a; }, (e) => { err = e; })).toBe(true);
      expect(auth).toBe(true);
      expect(err).toBe(null);

      expect(handleVerifyPinAction('000000', (a) => { auth = a; }, (e) => { err = e; })).toBe(false);
      expect(err).toContain('Incorrect');
    });

    it('executes handleLightCandleAction and handleAddTributeAction', () => {
      let count = 10;
      let lit = false;
      handleLightCandleAction((val) => { count = typeof val === 'function' ? val(count) : val; return count; }, (l) => { lit = l; });
      expect(lit).toBe(true);
      expect(count).toBe(11);

      let tributes: Tribute[] = [];
      let reset = false;
      const success = handleAddTributeAction('Maria', 'Daughter', 'Love you', tributes, (t) => { tributes = t; }, () => { reset = true; });
      expect(success).toBe(true);
      expect(tributes.length).toBe(1);
      expect(reset).toBe(true);

      const fail = handleAddTributeAction('', '', '', tributes, (t) => { tributes = t; }, () => {});
      expect(fail).toBe(false);
    });

    it('builds tribute records', () => {
      const tribute = buildTribute('Maria', 'Niece', 'Prayers from abroad');
      expect(tribute.senderName).toBe('Maria');
      expect(tribute.relationship).toBe('Niece');
      expect(tribute.message).toBe('Prayers from abroad');

      const fallback = buildTribute('', '', 'Rest in peace');
      expect(fallback.senderName).toBe('Anonymous Relative');
      expect(fallback.relationship).toBe('Friend/Family');
    });

    it('renders unauthenticated PIN gate view', () => {
      const html = renderToString(
        <EBurolView initialAuthenticated={false} initialPinError="Incorrect PIN" />
      );
      expect(html).toContain('E-Burol™ Private Wake Access');
      expect(html).toContain('Incorrect PIN');
    });
  });

  describe('PlanCatalog comparison table & handlers', () => {
    it('executes plan click actions and filter helpers', () => {
      let sel: Plan | null = null;
      let enr: Plan | null = null;
      handleSelectPlanClick(INITIAL_PLANS[0], (p) => { sel = p; });
      handleEnrollPlanClick(INITIAL_PLANS[1], (p) => { enr = p; });
      expect(sel).toBe(INITIAL_PLANS[0]);
      expect(enr).toBe(INITIAL_PLANS[1]);

      let cat = '';
      let bud = '';
      let comp = false;
      const helpers = createCatalogFilterHelpers(
        (c) => { cat = c; },
        (b) => { bud = b; },
        (fn) => { comp = typeof fn === 'function' ? fn(comp) : fn; return comp; }
      );
      helpers.selectCategory('Casket');
      expect(cat).toBe('Casket');
      helpers.selectBudget('Under60k');
      expect(bud).toBe('Under60k');
      helpers.toggleComparison();
      expect(comp).toBe(true);
    });

    it('renders side-by-side comparison table when enabled', () => {
      const html = renderToString(
        <PlanCatalog
          onSelectPlan={() => {}}
          onEnrollPlan={() => {}}
          initialShowComparison={true}
        />
      );
      expect(html).toContain('Package Comparison Matrix');
      expect(html).toContain('Return of Premium');
    });
  });

  describe('filterPlans', () => {
    it('filters by category', () => {
      const caskets = filterPlans(INITIAL_PLANS, 'Casket', 'All');
      expect(caskets.every((p) => p.category === 'Casket')).toBe(true);

      const cremations = filterPlans(INITIAL_PLANS, 'Cremation', 'All');
      expect(cremations.every((p) => p.category === 'Cremation')).toBe(true);

      const all = filterPlans(INITIAL_PLANS, 'All', 'All');
      expect(all.length).toBe(6);
    });

    it('filters by budget', () => {
      const under60k = filterPlans(INITIAL_PLANS, 'All', 'Under60k');
      expect(under60k.every((p) => p.basePrice < 60000)).toBe(true);

      const mid = filterPlans(INITIAL_PLANS, 'All', '60kTo100k');
      expect(mid.every((p) => p.basePrice >= 60000 && p.basePrice <= 100000)).toBe(true);

      const over100k = filterPlans(INITIAL_PLANS, 'All', 'Over100k');
      expect(over100k.every((p) => p.basePrice > 100000)).toBe(true);
    });
  });

  describe('filterChapelsList', () => {
    it('filters by region and crematorium', () => {
      const ncr = filterChapelsList(INITIAL_CHAPELS, 'NCR', false, '');
      expect(ncr.every((c) => c.region === 'NCR')).toBe(true);

      const crem = filterChapelsList(INITIAL_CHAPELS, 'All', true, '');
      expect(crem.every((c) => c.hasCrematorium)).toBe(true);

      const searched = filterChapelsList(INITIAL_CHAPELS, 'All', false, 'Davao');
      expect(searched.length).toBe(1);
      expect(searched[0].id).toBe('davao-central');

      const byAddress = filterChapelsList(INITIAL_CHAPELS, 'All', false, 'Balibago');
      expect(byAddress.length).toBe(1);
      expect(byAddress[0].id).toBe('pampanga-angeles');
    });
  });
});