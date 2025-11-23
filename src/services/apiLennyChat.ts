import { supabase } from "./SupabaseConfig"

export const getChatHistory = async (user_id: string | undefined) => {

    const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('business_id', user_id)

    if (!data) {

    }
    if (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }

    // console.log("Raw fetched data:", data);
    const uniqueSessionIds = Array.from(new Set(data.map(item => item.id)));

    return uniqueSessionIds;
}

export const getDefiningChat = async (session_id: string) => {
    const { data, error } = await supabase
        .from('conversations')
        .select('question')
        .eq('session_id', session_id)
        .order('started_at', { ascending: true }) // Order by created_at in ascending order

    if (error) {
        console.error("Error fetching defining chat:", error);
        return null;
    }
    if (data && data.length > 0) {
        return data[0]; // Return the first message in the session
    }
    return null; // Return null if no messages found
}

export const getChatHistoryBySession = async (session_id: string) => {
    const { data, error } = await supabase
        .from('conversations')
        .select('question, answer, started_at')
        .eq('session_id', session_id)
        .order('started_at', { ascending: true }) // Order by created_at in ascending order
    if (error) {
        console.error("Error fetching chat by session:", error);
        return [];
    }
    return data || [];
}

export const sendMessage = async (user_id: string | undefined, session_id: string, question: string, user_name: string| undefined) => {
    try {
        const response = await fetch('https://lennyrag-457329834011.europe-west4.run.app/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, session_id, question, user_name }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error sending message:", error);
    }
}


export const createASessionId = async (business_id:string | undefined) => {
    const { data, error } = await supabase
        .from('sessions')
        .insert([{ business_id: business_id }])
        .select('id')
        .single();

    if (error) {
        console.error("Error creating session ID:", error);
        return null;
    }

    if (data) {
        console.log("Created new session ID:", data);
        return data; // Return new session ID
    } 
}