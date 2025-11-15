import { calculateTrialEndDate, isTrialActive, getDaysRemainingInTrial } from '../src/utils/trialHelpers';

describe('Trial Helpers', () => {
  describe('calculateTrialEndDate', () => {
    it('should calculate correct end date for 30 day trial', () => {
      const startDate = new Date('2024-01-01');
      const endDate = calculateTrialEndDate(startDate, 30);
      
      expect(endDate.getDate()).toBe(31);
      expect(endDate.getMonth()).toBe(0); // January
    });

    it('should calculate correct end date for 7 day trial', () => {
      const startDate = new Date('2024-01-01');
      const endDate = calculateTrialEndDate(startDate, 7);
      
      expect(endDate.getDate()).toBe(8);
      expect(endDate.getMonth()).toBe(0);
    });
  });

  describe('isTrialActive', () => {
    it('should return true for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      
      expect(isTrialActive(futureDate)).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      
      expect(isTrialActive(pastDate)).toBe(false);
    });
  });

  describe('getDaysRemainingInTrial', () => {
    it('should return correct days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const daysRemaining = getDaysRemainingInTrial(futureDate);
      expect(daysRemaining).toBeGreaterThanOrEqual(4);
      expect(daysRemaining).toBeLessThanOrEqual(5);
    });

    it('should return 0 for expired trial', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      
      expect(getDaysRemainingInTrial(pastDate)).toBe(0);
    });
  });
});
