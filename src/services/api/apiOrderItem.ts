import { supabase } from './../SupabaseConfig';

interface OrderItem {
    id?: string;
    order_id?: string | null;
    product_id?: string | null;
    quantity: number;
    fulfilled_quantity?: number | null;
    price: number;
}

// Get all order items
export async function getOrderItems(): Promise<OrderItem[] | null> {
    try {
        const { data, error } = await supabase.from('order_items').select('*');

        if (error) {
            console.error("Error fetching order items:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching order items:", err);
        return null;
    }
}

// Get a specific order item by ID
export async function getOrderItemById(id: string): Promise<OrderItem | null> {
    try {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching order item:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching order item:", err);
        return null;
    }
}

// Create a new order item
export async function createOrderItem(newData: OrderItem): Promise<OrderItem | null> {
    try {
        const { data, error } = await supabase
            .from('order_items')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating order item:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating order item:", err);
        return null;
    }
}

// Update an order item by ID
export async function updateOrderItem(id: string, updatedData: Partial<OrderItem>): Promise<OrderItem | null> {
    try {
        const { data, error } = await supabase
            .from('order_items')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating order item:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating order item:", err);
        return null;
    }
}

// Delete an order item by ID
export async function deleteOrderItem(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('order_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting order item:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting order item:", err);
        return false;
    }
}
