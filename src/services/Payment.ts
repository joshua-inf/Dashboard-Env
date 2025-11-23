import { supabase } from './SupabaseConfig';
import { Payment } from '@/types/Payment';

// ✅ Create a Payment Record
export async function createPayment(newPayment: Omit<Payment, 'payment_id' | 'payment_date'>): Promise<Payment | null> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([{
                user_id: newPayment.user_id ?? null,
                amount: newPayment.amount,
                payment_method: newPayment.payment_method ?? null,
                payment_status: newPayment.payment_status ?? 'Pending',
            }])
            .single();

        if (error) {
            console.error("Error creating payment:", error.message);
            return null;
        }

        console.log("Payment created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating payment:", err);
        return null;
    }
}

// ✅ Get All Payments
export async function getAllPayments(): Promise<Payment[] | null> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*');

        if (error) {
            console.error("Error fetching payments:", error.message);
            return null;
        }

        console.log("Payments fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payments:", err);
        return null;
    }
}

// ✅ Get Payments by User ID
export async function getPaymentsByUserId(userId: number): Promise<Payment[] | null> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching payments for user:", error.message);
            return null;
        }

        console.log("User payments fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payments:", err);
        return null;
    }
}

// ✅ Update Payment Status
export async function updatePaymentStatus(paymentId: number, newStatus: 'Pending' | 'Completed' | 'Failed'): Promise<Payment | null> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .update({ payment_status: newStatus })
            .eq('payment_id', paymentId)
            .single();

        if (error) {
            console.error("Error updating payment status:", error.message);
            return null;
        }

        console.log("Payment status updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating payment status:", err);
        return null;
    }
}

// ✅ Delete a Payment Record
export async function deletePayment(paymentId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('payments')
            .delete()
            .eq('payment_id', paymentId);

        if (error) {
            console.error("Error deleting payment:", error.message);
            return false;
        }

        console.log("Payment deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting payment:", err);
        return false;
    }
}
