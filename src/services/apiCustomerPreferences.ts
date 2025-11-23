import { supabase } from './SupabaseConfig';
import { CustomerPreferences} from "@/types/CustomerPreferences";

export async function createCustomerPreferences(newPreferences: Omit<CustomerPreferences, 'preference_id'>): Promise<CustomerPreferences | null> {
    try {
        const { data, error } = await supabase
            .from('customer_preferences')
            .insert([
                {
                    customer_id: newPreferences.customer_id,
                    preferred_products: newPreferences.preferred_products,
                    preferred_contact_method: newPreferences.preferred_contact_method,
                },
            ])
            .single();

        if (error) {
            console.error("Error creating customer preferences:", error.message);
            return null;
        }

        console.log("Customer preferences created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating customer preferences:", err);
        return null;
    }
}

export async function getAllCustomerPreferences(): Promise<CustomerPreferences[] | null> {
    try {
        const { data, error } = await supabase
            .from('customer_preferences')
            .select('*');

        if (error) {
            console.error("Error fetching customer preferences:", error.message);
            return null;
        }

        console.log("Customer preferences fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching customer preferences:", err);
        return null;
    }
}

export async function getCustomerPreferencesById(preferenceId: number): Promise<CustomerPreferences | null> {
    try {
        const { data, error } = await supabase
            .from('customer_preferences')
            .select('*')
            .eq('preference_id', preferenceId)
            .single();

        if (error) {
            console.error("Error fetching customer preferences:", error.message);
            return null;
        }

        console.log("Customer preferences fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching customer preferences:", err);
        return null;
    }
}

export async function updateCustomerPreferences(updatedPreferences: CustomerPreferences): Promise<CustomerPreferences | null> {
    try {
        const { data, error } = await supabase
            .from('customer_preferences')
            .update({
                customer_id: updatedPreferences.customer_id,
                preferred_products: updatedPreferences.preferred_products,
                preferred_contact_method: updatedPreferences.preferred_contact_method,
            })
            .eq('preference_id', updatedPreferences.preference_id)
            .single();

        if (error) {
            console.error("Error updating customer preferences:", error.message);
            return null;
        }

        console.log("Customer preferences updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating customer preferences:", err);
        return null;
    }
}

export async function deleteCustomerPreferences(preferenceId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('customer_preferences')
            .delete()
            .eq('preference_id', preferenceId);

        if (error) {
            console.error("Error deleting customer preferences:", error.message);
            return false;
        }

        console.log("Customer preferences deleted successfully:", data);
        return true;
    } catch (err) {
        console.error("Unexpected error deleting customer preferences:", err);
        return false;
    }
}
