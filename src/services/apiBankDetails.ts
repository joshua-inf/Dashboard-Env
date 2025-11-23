import { supabase } from './SupabaseConfig';
import { BankAccountDetails } from '@/types/BankAccountDetails';

export async function createBankAccount(newAccount: Omit<BankAccountDetails, 'account_id'>): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .insert([
                {
                    user_id: newAccount.user_id,
                    bank_name: newAccount.bank_name,
                    account_number: newAccount.account_number,
                    account_type: newAccount.account_type,
                },
            ])
            .single();

        if (error) {
            console.error("Error creating bank account:", error.message);
            return null;
        }

        console.log("Bank account created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating bank account:", err);
        return null;
    }
}

export async function getAllBankAccounts(): Promise<BankAccountDetails[] | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .select('*');

        if (error) {
            console.error("Error fetching bank accounts:", error.message);
            return null;
        }

        console.log("Bank accounts fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching bank accounts:", err);
        return null;
    }
}

export async function getBankAccountById(accountId: number): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .select('*')
            .eq('account_id', accountId)
            .single();

        if (error) {
            console.error("Error fetching bank account:", error.message);
            return null;
        }

        console.log("Bank account fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching bank account:", err);
        return null;
    }
}

export async function updateBankAccount(updatedAccount: BankAccountDetails): Promise<BankAccountDetails | null> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .update({
                user_id: updatedAccount.user_id,
                bank_name: updatedAccount.bank_name,
                account_number: updatedAccount.account_number,
                account_type: updatedAccount.account_type,
            })
            .eq('account_id', updatedAccount.account_id)
            .single();

        if (error) {
            console.error("Error updating bank account:", error.message);
            return null;
        }

        console.log("Bank account updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating bank account:", err);
        return null;
    }
}

export async function deleteBankAccount(accountId: number): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('bank_account_details')
            .delete()
            .eq('account_id', accountId);

        if (error) {
            console.error("Error deleting bank account:", error.message);
            return false;
        }

        console.log("Bank account deleted successfully:", data);
        return true;
    } catch (err) {
        console.error("Unexpected error deleting bank account:", err);
        return false;
    }
}

