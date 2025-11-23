import { OrderData } from '@/types/Orders';
import { supabase } from './../SupabaseConfig';
import { Customers } from '@/types/Customers';
import { TransactionTableType } from '@/types/TransactionsTablePopup';

interface Sale {
    id?: string;
    business_id?: string | null;
    customer_id?: string | null;
    product_id?: string | null;
    amount: number;
    tax_amount?: number | null;
    payment_method: 'credit' | 'debit' | 'cash';
    sale_date?: string;
}

// Get all sales
export async function getSales(): Promise<Sale[] | null> {
    try {
        const { data, error } = await supabase.from('sales').select('*');

        if (error) {
            console.error("Error fetching sales:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching sales:", err);
        return null;
    }
}

// Get a specific sale by ID
export async function getSaleById(id: string): Promise<Sale | null> {
    try {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching sale:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching sale:", err);
        return null;
    }
}

// Create a new sale
export async function createSale(newData: Sale): Promise<Sale | null> {
    try {
        const { data, error } = await supabase
            .from('sales')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating sale:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating sale:", err);
        return null;
    }
}

// Update a sale by ID
export async function updateSale(id: string, updatedData: Partial<Sale>): Promise<Sale | null> {
    try {
        const { data, error } = await supabase
            .from('sales')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating sale:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating sale:", err);
        return null;
    }
}

// Delete a sale by ID
export async function deleteSale(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting sale:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting sale:", err);
        return false;
    }
}


export const getSalesAnalysis = (business_id: string | null): Promise<TransactionTableType> => {
    let orderdata: OrderData[] = [];
    let CustomerData: Customers[] = [];


    return new Promise(async (resolve, reject) => {

        // orderData
        try {
            const { data, error } = await supabase
                .from('orders')
                .select()
                .eq('business_id', business_id)

            if (data) {
                orderdata = data;
            }

            if (error) {
                reject(error)
            }
        } catch (error) {
            reject(error)
        }


        // customerData
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('business_id', business_id)

            if (data) {
                CustomerData = data;
            }

            if (error) {
                reject(error)
            }

        } catch (error) {
            reject(error)
        }


        resolve({orderData: orderdata, CustomerData: CustomerData })
       


    })
}