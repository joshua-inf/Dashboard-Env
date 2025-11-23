import { businessOnwersType } from '@/types/businesses';
import { supabase } from './../SupabaseConfig';

interface BusinessOwner {
    id?: string;
    business_id?: string;
    user_id?: string;
}

// Get all business owners
export async function getBusinessOwners(): Promise<BusinessOwner[] | null> {
    try {
        const { data, error } = await supabase.from('business_owners').select('*');

        if (error) {
            console.error("Error fetching business owners:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching business owners:", err);
        return null;
    }
}

// Get a specific business owner by ID
export async function getBusinessOwnerById(id: string): Promise<businessOnwersType[] | null> {
    try {
        const { data, error } = await supabase
            .from('business_owners')
            .select('*')
            .eq('user_id', id)

        if (error) {
            console.error("Error fetching business owner:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching business owner:", err);
        return null;
    }
}

// Create a new business owner
export async function createBusinessOwner(newData: BusinessOwner): Promise<BusinessOwner | null> {
    try {
        const { data, error } = await supabase
            .from('business_owners')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating business owner:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating business owner:", err);
        return null;
    }
}

// Update a business owner by ID
export async function updateBusinessOwner(id: string, updatedData: Partial<BusinessOwner>): Promise<BusinessOwner | null> {
    try {
        const { data, error } = await supabase
            .from('business_owners')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating business owner:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating business owner:", err);
        return null;
    }
}

// Delete a business owner by ID
export async function deleteBusinessOwner(id: string): Promise<BusinessOwner | null> {
    try {
        const { data, error } = await supabase
            .from('business_owners')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting business owner:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting business owner:", err);
        return null;
    }
}
