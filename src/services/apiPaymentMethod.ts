import { supabase } from './SupabaseConfig';
import { PaymentMethod } from '@/types/PaymentMethod';

// ✅ Create a Payment Method
export async function createPaymentMethod(newMethod: Omit<PaymentMethod, 'method_id'>): Promise<PaymentMethod | null> {
    try {
        // If setting a method as default, unset previous defaults
        if (newMethod.is_default) {
            await supabase
                .from('payment_methods')
                .update({ is_default: false })
                .eq('user_id', newMethod.user_id);
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .insert([{
                user_id: newMethod.user_id ?? null,
                method_name: newMethod.method_name,
                is_default: newMethod.is_default ?? false,
            }])
            .single();

        if (error) {
            console.error("Error creating payment method:", error.message);
            return null;
        }

        console.log("Payment method created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating payment method:", err);
        return null;
    }
}

// ✅ Get All Payment Methods
export async function getAllPaymentMethods(): Promise<PaymentMethod[] | null> {
    try {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*');

        if (error) {
            console.error("Error fetching payment methods:", error.message);
            return null;
        }

        console.log("Payment methods fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payment methods:", err);
        return null;
    }
}

// ✅ Get Payment Methods by User ID
export async function getPaymentMethodsByUserId(userId: number): Promise<PaymentMethod[] | null> {
    try {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching payment methods for user:", error.message);
            return null;
        }

        console.log("User payment methods fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching payment methods:", err);
        return null;
    }
}

// ✅ Update a Payment Method (Rename or Change Default)
export async function updatePaymentMethod(methodId: number, updatedMethod: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
    try {
        // If updating default status, reset others
        if (updatedMethod.is_default) {
            const { data: existingMethod } = await supabase
                .from('payment_methods')
                .select('user_id')
                .eq('method_id', methodId)
                .single();

            if (existingMethod) {
                await supabase
                    .from('payment_methods')
                    .update({ is_default: false })
                    .eq('user_id', existingMethod.user_id);
            }
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .update(updatedMethod)
            .eq('method_id', methodId)
            .single();

        if (error) {
            console.error("Error updating payment method:", error.message);
            return null;
        }

        console.log("Payment method updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating payment method:", err);
        return null;
    }
}

// ✅ Delete a Payment Method
export async function deletePaymentMethod(methodId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('method_id', methodId);

        if (error) {
            console.error("Error deleting payment method:", error.message);
            return false;
        }

        console.log("Payment method deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting payment method:", err);
        return false;
    }
}
