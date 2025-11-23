import { supabase } from './../SupabaseConfig';

interface BankAccountDetails {
    id?: string;
    business_id?: string;
    bank_name: string;
    account_number: string;
    account_type?: string;
}

// Get all bank accounts
export async function getBankAccounts(): Promise<BankAccountDetails[] | null> {
    try {
        const { data, error } = await supabase.from('bank_account_details').select('*');

        if (error) {
            console.error("Error fetching bank accounts:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching bank accounts:", err);
        return null;
    }
}

// Get a specific bank account by ID
export async function getBankAccountById(id: string): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching bank account:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching bank account:", err);
        return null;
    }
}

// Create a new bank account
export async function createBankAccount(newData: BankAccountDetails): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating bank account:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating bank account:", err);
        return null;
    }
}

// Update a bank account by ID
export async function updateBankAccount(id: string, updatedData: Partial<BankAccountDetails>): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating bank account:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating bank account:", err);
        return null;
    }
}

// Delete a bank account by ID
export async function deleteBankAccount(id: string): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting bank account:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting bank account:", err);
        return null;
    }
}
