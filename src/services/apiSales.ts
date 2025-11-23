import { supabase } from './SupabaseConfig';
import { Sale } from '@/types/Sales'

// ✅ Create Sale
export async function createSale(newSale: Omit<Sale, 'sale_id'>): Promise<Sale | null> {
  try {
    const { data, error } = await supabase
        .from('sales')
        .insert([
          {
            customer_id: newSale.customer_id,
            user_id: newSale.user_id,
            amount: newSale.amount,
            sale_date: newSale.sale_date ?? new Date().toISOString(),
          },
        ])
        .single();

    if (error) {
      console.error("Error creating sale:", error.message);
      return null;
    }

    console.log("Sale created successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error creating sale:", err);
    return null;
  }
}

// ✅ Get All Sales
export async function getAllSales(): Promise<Sale[] | null> {
  try {
    const { data, error } = await supabase
        .from('sales')
        .select('*');

    if (error) {
      console.error("Error fetching sales:", error.message);
      return null;
    }

    console.log("Sales fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching sales:", err);
    return null;
  }
}

// ✅ Get Sales by Customer ID
export async function getSalesByCustomerId(customerId: number): Promise<Sale[] | null> {
  try {
    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_id', customerId);

    if (error) {
      console.error("Error fetching sales:", error.message);
      return null;
    }

    console.log("Sales fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching sales:", err);
    return null;
  }
}

// ✅ Get Sales by User ID
export async function getSalesByUserId(userId: number): Promise<Sale[] | null> {
  try {
    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', userId);

    if (error) {
      console.error("Error fetching sales:", error.message);
      return null;
    }

    console.log("Sales fetched successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching sales:", err);
    return null;
  }
}

// ✅ Update Sale
export async function updateSale(saleId: number, updatedSale: Partial<Omit<Sale, 'sale_id'>>): Promise<Sale | null> {
  try {
    const { data, error } = await supabase
        .from('sales')
        .update(updatedSale)
        .eq('sale_id', saleId)
        .single();

    if (error) {
      console.error("Error updating sale:", error.message);
      return null;
    }

    console.log("Sale updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error updating sale:", err);
    return null;
  }
}

// ✅ Delete Sale
export async function deleteSale(saleId: number): Promise<boolean> {
  try {
    const { error } = await supabase
        .from('sales')
        .delete()
        .eq('sale_id', saleId);

    if (error) {
      console.error("Error deleting sale:", error.message);
      return false;
    }

    console.log("Sale deleted successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error deleting sale:", err);
    return false;
  }
}
