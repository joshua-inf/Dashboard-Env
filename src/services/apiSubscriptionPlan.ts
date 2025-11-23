import { supabase } from './SupabaseConfig';
import { SubscriptionPlan } from '@/types/SubscriptionPlan';

// ✅ Create a Subscription Plan
export async function createSubscriptionPlan(newPlan: Omit<SubscriptionPlan, 'plan_id'>): Promise<SubscriptionPlan | null> {
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .insert([{
                plan_name: newPlan.plan_name,
                features: newPlan.features ?? null,
                price: newPlan.price,
                duration_in_days: newPlan.duration_in_days,
            }])
            .single();

        if (error) {
            console.error("Error creating subscription plan:", error.message);
            return null;
        }

        console.log("Subscription plan created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating subscription plan:", err);
        return null;
    }
}

// ✅ Get All Subscription Plans
export async function getAllSubscriptionPlans(): Promise<SubscriptionPlan[] | null> {
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*');

        if (error) {
            console.error("Error fetching subscription plans:", error.message);
            return null;
        }

        console.log("Subscription plans fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching subscription plans:", err);
        return null;
    }
}

// ✅ Get a Subscription Plan by ID
export async function getSubscriptionPlanById(planId: number): Promise<SubscriptionPlan | null> {
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('plan_id', planId)
            .single();

        if (error) {
            console.error("Error fetching subscription plan:", error.message);
            return null;
        }

        console.log("Subscription plan fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching subscription plan:", err);
        return null;
    }
}

// ✅ Update a Subscription Plan
export async function updateSubscriptionPlan(planId: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    try {
        const { data, error } = await supabase
            .from('subscription_plans')
            .update(updates)
            .eq('plan_id', planId)
            .single();

        if (error) {
            console.error("Error updating subscription plan:", error.message);
            return null;
        }

        console.log("Subscription plan updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating subscription plan:", err);
        return null;
    }
}

// ✅ Delete a Subscription Plan
export async function deleteSubscriptionPlan(planId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('subscription_plans')
            .delete()
            .eq('plan_id', planId);

        if (error) {
            console.error("Error deleting subscription plan:", error.message);
            return false;
        }

        console.log("Subscription plan deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting subscription plan:", err);
        return false;
    }
}
