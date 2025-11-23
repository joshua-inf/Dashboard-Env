import { supabase } from './SupabaseConfig';
import { OnboardingInfo } from "@/types/OnboardingInfo";

// ✅ Create Onboarding Info
export async function createOnboardingInfo(newInfo: Omit<OnboardingInfo, 'info_id'>): Promise<OnboardingInfo | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_info')
            .insert([
                {
                    user_id: newInfo.user_id,
                    business_name: newInfo.business_name,
                    industry_niche: newInfo.industry_niche,
                    business_size: newInfo.business_size,
                },
            ])
            .single();

        if (error) {
            console.error("Error creating onboarding info:", error.message);
            return null;
        }

        console.log("Onboarding info created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating onboarding info:", err);
        return null;
    }
}

// ✅ Get All Onboarding Info
export async function getAllOnboardingInfo(): Promise<OnboardingInfo[] | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_info')
            .select('*');

        if (error) {
            console.error("Error fetching onboarding info:", error.message);
            return null;
        }

        console.log("Onboarding info fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching onboarding info:", err);
        return null;
    }
}

// ✅ Get Onboarding Info by User ID
export async function getOnboardingInfoByUserId(userId: number): Promise<OnboardingInfo | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_info')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error("Error fetching onboarding info:", error.message);
            return null;
        }

        console.log("Onboarding info fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching onboarding info:", err);
        return null;
    }
}

// ✅ Update Onboarding Info
export async function updateOnboardingInfo(infoId: number, updatedInfo: Partial<Omit<OnboardingInfo, 'info_id'>>): Promise<OnboardingInfo | null> {
    try {
        const { data, error } = await supabase
            .from('onboarding_info')
            .update(updatedInfo)
            .eq('info_id', infoId)
            .single();

        if (error) {
            console.error("Error updating onboarding info:", error.message);
            return null;
        }

        console.log("Onboarding info updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating onboarding info:", err);
        return null;
    }
}

// ✅ Delete Onboarding Info
export async function deleteOnboardingInfo(infoId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('onboarding_info')
            .delete()
            .eq('info_id', infoId);

        if (error) {
            console.error("Error deleting onboarding info:", error.message);
            return false;
        }

        console.log("Onboarding info deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting onboarding info:", err);
        return false;
    }
}
