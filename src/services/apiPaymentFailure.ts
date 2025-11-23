import { supabase } from './SupabaseConfig'; 
import { PaymentFailure } from '@/types/PaymentFailure'; 

// ✅ Log a Failed Payment
export async function logPaymentFailure(failure: Omit<PaymentFailure, 'failure_id' | 'failure_date'>): Promise<PaymentFailure | null> {
    try {
        const { data, error } = await supabase
            .from('payment_failures')
            .insert([{
                user_id: failure.user_id ?? null,
                failure_reason: failure.failure_reason,
                retry_count: failure.retry_count ?? 0,
            }])
            .single();

        if (error) {
            console.error("Error logging payment failure:", error.message);
            return null;
        }

        console.log("Payment failure logged successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error logging payment failure:", err);
        return null;
    }
}

// ✅ Get All Payment Failures
export async function getAllPaymentFailures(): Promise<PaymentFailure[] | null> {
    try {
        const { data, error } = await supabase
            .from('payment_failures')
            .select('*');

        if (error) {
            console.error("Error fetching payment failures:", error.message);
            return null;
        }

        console.log("Payment failures fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payment failures:", err);
        return null;
    }
}

// ✅ Get Payment Failures by User ID
export async function getPaymentFailuresByUserId(userId: number): Promise<PaymentFailure[] | null> {
    try {
        const { data, error } = await supabase
            .from('payment_failures')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching payment failures for user:", error.message);
            return null;
        }

        console.log("User payment failures fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payment failures:", err);
        return null;
    }
}

// ✅ Update Retry Count for a Failed Payment
export async function updateRetryCount(failureId: number, retryCount: number): Promise<PaymentFailure | null> {
    try {
        const { data, error } = await supabase
            .from('payment_failures')
            .update({ retry_count: retryCount })
            .eq('failure_id', failureId)
            .single();

        if (error) {
            console.error("Error updating retry count:", error.message);
            return null;
        }

        console.log("Retry count updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating retry count:", err);
        return null;
    }
}

// ✅ Delete a Payment Failure Record
export async function deletePaymentFailure(failureId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('payment_failures')
            .delete()
            .eq('failure_id', failureId);

        if (error) {
            console.error("Error deleting payment failure record:", error.message);
            return false;
        }

        console.log("Payment failure record deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting payment failure record:", err);
        return false;
    }
}
