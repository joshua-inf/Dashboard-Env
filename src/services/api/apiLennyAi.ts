import { supabase } from '../SupabaseConfig';

interface LennyAIQuery {
    id?: string;
    user_id?: string | null;
    query_text: string;
    response_text: string;
    analytics_page?: 'home' | 'analytics' | 'dashboard' | null;  // Assuming analytics_page is a type that limits options
    user_feedback_score?: number | null;
    response_generated_at?: string;
}

// Get all AI queries
export async function getLennyAIQueries(): Promise<LennyAIQuery[] | null> {
    try {
        const { data, error } = await supabase.from('lenny_ai_queries').select('*');

        if (error) {
            console.error("Error fetching AI queries:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI queries:", err);
        return null;
    }
}

// Get a specific AI query by ID
export async function getLennyAIQueryById(id: string): Promise<LennyAIQuery | null> {
    try {
        const { data, error } = await supabase
            .from('lenny_ai_queries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching AI query:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching AI query:", err);
        return null;
    }
}

// Create a new AI query
export async function createLennyAIQuery(newData: LennyAIQuery): Promise<LennyAIQuery | null> {
    try {
        const { data, error } = await supabase
            .from('lenny_ai_queries')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating AI query:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating AI query:", err);
        return null;
    }
}

// Update an AI query by ID
export async function updateLennyAIQuery(id: string, updatedData: Partial<LennyAIQuery>): Promise<LennyAIQuery | null> {
    try {
        const { data, error } = await supabase
            .from('lenny_ai_queries')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating AI query:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating AI query:", err);
        return null;
    }
}

// Delete an AI query by ID
export async function deleteLennyAIQuery(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('lenny_ai_queries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting AI query:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting AI query:", err);
        return false;
    }
}
