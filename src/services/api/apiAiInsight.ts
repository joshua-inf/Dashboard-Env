import { supabase } from './../SupabaseConfig';

interface AiInsights {
    id?: string;
    business_id?: string;
    insight_type: string; 
    related_sales_id?: string;
    related_customer_id?: string;
    insight_data: object;
    confidence_score?: number;
    generated_at?: string; 
}

// Get all AI insights
export async function getAiInsights(): Promise<AiInsights[] | null> {
    try {
        const { data, error } = await supabase.from('ai_insights').select('*');

        if (error) {
            console.error("Error fetching AI insights:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI insights:", err);
        return null;
    }
}

// Get a specific AI insight by ID
export async function getAiInsightById(id: string): Promise<AiInsights | null> {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching AI insight:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI insight:", err);
        return null;
    }
}

// Create a new AI insight
export async function createAiInsight(newData: AiInsights): Promise<AiInsights | null> {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating AI insight:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating AI insight:", err);
        return null;
    }
}

// Update an AI insight by ID
export async function updateAiInsight(id: string, updatedData: Partial<AiInsights>): Promise<AiInsights | null> {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating AI insight:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating AI insight:", err);
        return null;
    }
}

// Delete an AI insight by ID
export async function deleteAiInsight(id: string): Promise<AiInsights | null> {
    try {
        const { data, error } = await supabase
            .from('ai_insights')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting AI insight:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error deleting AI insight:", err);
        return null;
    }
}
