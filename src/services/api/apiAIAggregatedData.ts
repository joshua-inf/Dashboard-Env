import { supabase } from './../SupabaseConfig';

interface AiAggregatedData {
    id?: string;
    user_id?: string;
    business_id?: string;
    customer_count?: number;
    total_sales?: number;
    total_orders?: number;
    most_purchased_product?: string;
    customer_behavior?: object;
    revenue_forecast?: object;
    last_updated?: string;  // Timestamp
}

// Get all AI aggregated data
export async function getAiAggregatedData(): Promise<AiAggregatedData[] | null> {
    try {
        const { data, error } = await supabase.from('ai_aggregated_data').select('*');

        if (error) {
            console.error("Error fetching AI aggregated data:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI aggregated data:", err);
        return null;
    }
}

// Get a specific AI aggregated record by ID
export async function getAiAggregatedDataById(id: string): Promise<AiAggregatedData | null> {
    try {
        const { data, error } = await supabase
            .from('ai_aggregated_data')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching AI aggregated data:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI aggregated data:", err);
        return null;
    }
}

// Create AI aggregated data
export async function createAiAggregatedData(newData: AiAggregatedData): Promise<AiAggregatedData | null> {
    try {
        const { data, error } = await supabase
            .from('ai_aggregated_data')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating AI aggregated data:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating AI aggregated data:", err);
        return null;
    }
}

// Update AI aggregated data by ID
export async function updateAiAggregatedData(id: string, updatedData: Partial<AiAggregatedData>): Promise<AiAggregatedData | null> {
    try {
        const { data, error } = await supabase
            .from('ai_aggregated_data')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating AI aggregated data:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating AI aggregated data:", err);
        return null;
    }
}

// Delete AI aggregated data by ID
export async function deleteAiAggregatedData(id: string): Promise<AiAggregatedData | null> {
    try {
        const { data, error } = await supabase
            .from('ai_aggregated_data')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting AI aggregated data:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting AI aggregated data:", err);
        return null;
    }
}
