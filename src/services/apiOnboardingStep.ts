import { supabase } from './SupabaseConfig';
import { OnboardingStep } from '@/types/OnboardingStep';

// ✅ Create an Onboarding Step
export async function createOnboardingStep(step: Omit<OnboardingStep, 'step_id'>): Promise<OnboardingStep | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_steps')
            .insert([{
                user_id: step.user_id ?? null,
                step_description: step.step_description,
                completed: step.completed ?? false
            }])
            .single();

        if (error) {
            console.error("Error creating onboarding step:", error.message);
            return null;
        }

        console.log("Onboarding step created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating onboarding step:", err);
        return null;
    }
}

// ✅ Get All Onboarding Steps
export async function getAllOnboardingSteps(): Promise<OnboardingStep[] | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_steps')
            .select('*');

        if (error) {
            console.error("Error fetching onboarding steps:", error.message);
            return null;
        }

        console.log("Onboarding steps fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching onboarding steps:", err);
        return null;
    }
}

// ✅ Get Onboarding Steps by User ID
export async function getOnboardingStepsByUserId(userId: number): Promise<OnboardingStep[] | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_steps')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching onboarding steps for user:", error.message);
            return null;
        }

        console.log("User onboarding steps fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching onboarding steps:", err);
        return null;
    }
}

// ✅ Update Onboarding Step (Mark as Completed)
export async function markOnboardingStepComplete(stepId: number, completed: boolean = true): Promise<OnboardingStep | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_steps')
            .update({ completed })
            .eq('step_id', stepId)
            .single();

        if (error) {
            console.error("Error updating onboarding step:", error.message);
            return null;
        }

        console.log("Onboarding step updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating onboarding step:", err);
        return null;
    }
}

// ✅ Delete an Onboarding Step
export async function deleteOnboardingStep(stepId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('onboarding_steps')
            .delete()
            .eq('step_id', stepId);

        if (error) {
            console.error("Error deleting onboarding step:", error.message);
            return false;
        }

        console.log("Onboarding step deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting onboarding step:", err);
        return false;
    }
}
