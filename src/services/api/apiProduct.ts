import { supabase } from './../SupabaseConfig';

interface Product {
    id?: string;
    business_id?: string | null;
    name: string;
    description?: string | null;
    price: number;
    category?: string | null;
    stock?: number | null;
    sku: string;
    created_at?: string;
}

// Get all products
export async function getProducts(): Promise<Product[] | null> {
    try {
        const { data, error } = await supabase.from('products').select('*');

        if (error) {
            console.error("Error fetching products:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching products:", err);
        return null;
    }
}

// Get a specific product by ID
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching product:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching product:", err);
        return null;
    }
}

// Create a new product
export async function createProduct(newData: Product): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating product:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating product:", err);
        return null;
    }
}

// Update a product by ID
export async function updateProduct(id: string, updatedData: Partial<Product>): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating product:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating product:", err);
        return null;
    }
}

// Delete a product by ID
export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting product:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting product:", err);
        return false;
    }
}
