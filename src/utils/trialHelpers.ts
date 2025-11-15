/**
 * Calculates the trial end date based on the start date and duration
 * @param startDate - The trial start date
 * @param durationDays - Number of days for the trial period
 * @returns The trial end date
 */
export function calculateTrialEndDate(startDate: Date, durationDays: number): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  return endDate;
}

/**
 * Checks if a trial is still active
 * @param trialEndsAt - The trial end date
 * @returns True if trial is active, false otherwise
 */
export function isTrialActive(trialEndsAt: Date): boolean {
  return new Date() < new Date(trialEndsAt);
}

/**
 * Gets the number of days remaining in the trial
 * @param trialEndsAt - The trial end date
 * @returns Number of days remaining (0 if expired)
 */
export function getDaysRemainingInTrial(trialEndsAt: Date): number {
  const now = new Date();
  const endDate = new Date(trialEndsAt);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
