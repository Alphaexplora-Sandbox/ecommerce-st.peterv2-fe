import { computeAmortization } from '../../src/components/Calculator';

/**
 * CI/CD ERROR SIMULATION TEST SUITE
 * 
 * Objective:
 * Demonstrates a real test case failure caught by the automated pipeline
 * (Stage 10: ALPHACI 2 Quality -> frontend-tests).
 * 
 * FAILURE SCENARIO:
 * A developer or regression mistakenly asserts that St. George spot cash discount
 * should be 20% (₱33,000) instead of the authorized 10% (₱16,500).
 * 
 * CURRENT STATUS: FAILING (Simulated Error Active)
 * 
 * TO APPLY THE FIX:
 * Change the expected discount on line 29 from 33000 to 16500 (or set SIMULATION_FIXED = true).
 */

export const SIMULATION_FIXED = false;

describe('SIMULATED_FAILURE: Spot Cash Discount Calculation Bug', () => {
  it('TC-SIM-001: fails due to calculation assertion mismatch', () => {
    const result = computeAmortization(165000, 'spotcash');

    if (!SIMULATION_FIXED) {
      // INTENTIONAL FAILURE: Expecting 33,000 (20%) instead of actual 16,500 (10%)
      expect(result.discount).toBe(33000);
    } else {
      // THE FIX: Correct authorized 10% spot cash discount
      expect(result.discount).toBe(16500);
      expect(result.netPrice).toBe(148500);
    }
  });
});