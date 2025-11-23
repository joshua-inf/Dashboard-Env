import { supabase } from './SupabaseConfig';
import { MobileMoneyDetails } from "@/types/MobileMoneyDetails";

export async function createMobileMoneyDetail(newDetail: Omit<MobileMoneyDetails, 'detail_id'>): Promise<MobileMoneyDetails | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .insert([
                {
                    user_id: newDetail.user_id,
                    mobile_money_provider: newDetail.mobile_money_provider,
                    account_number: newDetail.account_number,
                },
            ])
            .single();

        if (error) {
            console.error("Error creating mobile money detail:", error.message);
            return null;
        }

        console.log("Mobile money detail created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating mobile money detail:", err);
        return null;
    }
}

export async function getAllMobileMoneyDetails(): Promise<MobileMoneyDetails[] | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .select('*');

        if (error) {
            console.error("Error fetching mobile money details:", error.message);
            return null;
        }

        console.log("Mobile money details fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching mobile money details:", err);
        return null;
    }
}

export async function getMobileMoneyDetailById(detailId: number): Promise<MobileMoneyDetails | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .select('*')
            .eq('detail_id', detailId)
            .single();

        if (error) {
            console.error("Error fetching mobile money detail:", error.message);
            return null;
        }

        console.log("Mobile money detail fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching mobile money detail:", err);
        return null;
    }
}

export async function updateMobileMoneyDetail(updatedDetail: MobileMoneyDetails): Promise<MobileMoneyDetails | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .update({
                user_id: updatedDetail.user_id,
                mobile_money_provider: updatedDetail.mobile_money_provider,
                account_number: updatedDetail.account_number,
            })
            .eq('detail_id', updatedDetail.detail_id)
            .single();

        if (error) {
            console.error("Error updating mobile money detail:", error.message);
            return null;
        }

        console.log("Mobile money detail updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating mobile money detail:", err);
        return null;
    }
}

export async function deleteMobileMoneyDetail(detailId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .delete()
            .eq('detail_id', detailId);

        if (error) {
            console.error("Error deleting mobile money detail:", error.message);
            return false;
        }

        console.log("Mobile money detail deleted successfully:", data);
        return true;
    } catch (err) {
        console.error("Unexpected error deleting mobile money detail:", err);
        return false;
    }
}
