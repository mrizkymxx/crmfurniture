import { supabase, config } from '../config/supabase';
import { Customer } from '../models/types';
import { calculateTrialEndDate, isTrialActive, getDaysRemainingInTrial } from '../utils/trialHelpers';

export class CustomerService {
  /**
   * Creates a new customer with trial period
   */
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer | null> {
    const trialStartDate = new Date();
    const trialEndDate = calculateTrialEndDate(trialStartDate, config.trialDurationDays);

    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customerData,
        trial_started_at: trialStartDate.toISOString(),
        trial_ends_at: trialEndDate.toISOString(),
        is_trial_active: true,
        subscription_status: 'trial',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }

    return data;
  }

  /**
   * Gets a customer by ID
   */
  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    return data;
  }

  /**
   * Gets all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Gets customers with active trials
   */
  async getActiveTrialCustomers(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_trial_active', true)
      .order('trial_ends_at', { ascending: true });

    if (error) {
      console.error('Error fetching active trial customers:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Updates customer subscription status
   */
  async updateSubscriptionStatus(
    customerId: string,
    status: 'trial' | 'active' | 'expired' | 'cancelled'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .update({
        subscription_status: status,
        is_trial_active: status === 'trial',
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }

    return true;
  }

  /**
   * Converts a trial customer to a paid subscription
   */
  async convertTrialToSubscription(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .update({
        subscription_status: 'active',
        is_trial_active: false,
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error converting trial to subscription:', error);
      return false;
    }

    return true;
  }

  /**
   * Gets trial status for a customer
   */
  async getTrialStatus(customerId: string): Promise<{
    isActive: boolean;
    daysRemaining: number;
    trialEndsAt: Date | null;
  } | null> {
    const customer = await this.getCustomer(customerId);
    
    if (!customer || !customer.trial_ends_at) {
      return null;
    }

    const trialEndsAt = new Date(customer.trial_ends_at);
    
    return {
      isActive: isTrialActive(trialEndsAt),
      daysRemaining: getDaysRemainingInTrial(trialEndsAt),
      trialEndsAt,
    };
  }

  /**
   * Extends trial period for a customer
   */
  async extendTrial(customerId: string, additionalDays: number): Promise<boolean> {
    const customer = await this.getCustomer(customerId);
    
    if (!customer || !customer.trial_ends_at) {
      return false;
    }

    const currentEndDate = new Date(customer.trial_ends_at);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDays);

    const { error } = await supabase
      .from('customers')
      .update({
        trial_ends_at: newEndDate.toISOString(),
        is_trial_active: true,
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error extending trial:', error);
      return false;
    }

    return true;
  }
}
