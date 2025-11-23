import { supabase } from './../SupabaseConfig';

interface MobileMoneyDetail {
    id?: string;
    business_id?: string | null;
    provider: string;
    account_number: string;
}

// Get all mobile money details
export async function getMobileMoneyDetails(): Promise<MobileMoneyDetail[] | null> {
    try {
        const { data, error } = await supabase.from('mobile_money_details').select('*');

        if (error) {
            console.error("Error fetching mobile money details:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching mobile money details:", err);
        return null;
    }
}

// Get a specific mobile money detail by ID
export async function getMobileMoneyDetailById(id: string): Promise<MobileMoneyDetail | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching mobile money detail:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching mobile money detail:", err);
        return null;
    }
}

// Create a new mobile money detail
export async function createMobileMoneyDetail(newData: MobileMoneyDetail): Promise<MobileMoneyDetail | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating mobile money detail:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating mobile money detail:", err);
        return null;
    }
}

// Update a mobile money detail by ID
export async function updateMobileMoneyDetail(id: string, updatedData: Partial<MobileMoneyDetail>): Promise<MobileMoneyDetail | null> {
    try {
        const { data, error } = await supabase
            .from('mobile_money_details')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating mobile money detail:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating mobile money detail:", err);
        return null;
    }
}

// Delete a mobile money detail by ID
export async function deleteMobileMoneyDetail(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('mobile_money_details')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting mobile money detail:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting mobile money detail:", err);
        return false;
    }
}
