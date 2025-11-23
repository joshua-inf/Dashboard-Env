import { supabase } from './SupabaseConfig';
import { CustomerConsent } from '@/types/CustomerConsent';

export async function createCustomerConsent(newConsent: Omit<CustomerConsent, 'consent_id'>): Promise<CustomerConsent | null> {
    try {
        const { data, error } = await supabase
            .from('customer_consent')
            .insert([
                {
                    customer_id: newConsent.customer_id,
                    consent_type: newConsent.consent_type,
                    consent_status: newConsent.consent_status,
                    granted_at: newConsent.granted_at || new Date().toISOString(),
                },
            ])
            .single();

        if (error) {
            console.error("Error creating customer consent:", error.message);
            return null;
        }

        console.log("Customer consent created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating customer consent:", err);
        return null;
    }
}

export async function getAllCustomerConsents(): Promise<CustomerConsent[] | null> {
    try {
        const { data, error } = await supabase
            .from('customer_consent')
            .select('*');

        if (error) {
            console.error("Error fetching customer consents:", error.message);
            return null;
        }

        console.log("Customer consents fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching customer consents:", err);
        return null;
    }
}

export async function getCustomerConsentById(consentId: number): Promise<CustomerConsent | null> {
    try {
        const { data, error } = await supabase
            .from('customer_consent')
            .select('*')
            .eq('consent_id', consentId)
            .single();

        if (error) {
            console.error("Error fetching customer consent:", error.message);
            return null;
        }

        console.log("Customer consent fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching customer consent:", err);
        return null;
    }
}

export async function updateCustomerConsent(updatedConsent: CustomerConsent): Promise<CustomerConsent | null> {
    try {
        const { data, error } = await supabase
            .from('customer_consent')
            .update({
                customer_id: updatedConsent.customer_id,
                consent_type: updatedConsent.consent_type,
                consent_status: updatedConsent.consent_status,
                granted_at: updatedConsent.granted_at,
            })
            .eq('consent_id', updatedConsent.consent_id)
            .single();

        if (error) {
            console.error("Error updating customer consent:", error.message);
            return null;
        }

        console.log("Customer consent updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating customer consent:", err);
        return null;
    }
}

export async function deleteCustomerConsent(consentId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('customer_consent')
            .delete()
            .eq('consent_id', consentId);

        if (error) {
            console.error("Error deleting customer consent:", error.message);
            return false;
        }

        console.log("Customer consent deleted successfully:", data);
        return true;
    } catch (err) {
        console.error("Unexpected error deleting customer consent:", err);
        return false;
    }
}
