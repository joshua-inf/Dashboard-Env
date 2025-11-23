import { supabase } from './../SupabaseConfig';

interface ChatbotConfiguration {
    id?: string;
    business_id?: string | null;
    config_data: object;
    version?: number;
    created_at?: string;
}

// Get all chatbot configurations
export async function getChatbotConfigurations(): Promise<ChatbotConfiguration[] | null> {
    try {
        const { data, error } = await supabase.from('chatbot_configurations').select('*');

        if (error) {
            console.error("Error fetching chatbot configurations:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching chatbot configurations:", err);
        return null;
    }
}

// Get a specific chatbot configuration by ID
export async function getChatbotConfigurationById(id: string): Promise<ChatbotConfiguration | null> {
    try {
        const { data, error } = await supabase
            .from('chatbot_configurations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching chatbot configuration:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching chatbot configuration:", err);
        return null;
    }
}

// Create a new chatbot configuration
export async function createChatbotConfiguration(newData: ChatbotConfiguration): Promise<ChatbotConfiguration | null> {
    try {
        const { data, error } = await supabase
            .from('chatbot_configurations')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating chatbot configuration:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating chatbot configuration:", err);
        return null;
    }
}

// Update a chatbot configuration by ID
export async function updateChatbotConfiguration(id: string, updatedData: Partial<ChatbotConfiguration>): Promise<ChatbotConfiguration | null> {
    try {
        const { data, error } = await supabase
            .from('chatbot_configurations')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating chatbot configuration:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating chatbot configuration:", err);
        return null;
    }
}

// Delete a chatbot configuration by ID
export async function deleteChatbotConfiguration(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('chatbot_configurations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting chatbot configuration:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting chatbot configuration:", err);
        return false;
    }
}
