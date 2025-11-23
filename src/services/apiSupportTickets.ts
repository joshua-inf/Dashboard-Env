import { supabase } from './SupabaseConfig'; 
import { SupportTicket } from '@/types/SupportTickets'; 

// ✅ Create a Support Ticket
export async function createSupportTicket(newTicket: Omit<SupportTicket, 'ticket_id' | 'created_at'>): Promise<SupportTicket | null> {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .insert([{
                user_id: newTicket.user_id ?? null,
                description: newTicket.description,
                ticket_status: newTicket.ticket_status ?? 'Open',
            }])
            .single();

        if (error) {
            console.error("Error creating support ticket:", error.message);
            return null;
        }

        console.log("Support ticket created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating support ticket:", err);
        return null;
    }
}

// ✅ Get All Support Tickets
export async function getAllSupportTickets(): Promise<SupportTicket[] | null> {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*');

        if (error) {
            console.error("Error fetching support tickets:", error.message);
            return null;
        }

        console.log("Support tickets fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching support tickets:", err);
        return null;
    }
}

// ✅ Get Support Tickets by User ID
export async function getSupportTicketsByUserId(userId: number): Promise<SupportTicket[] | null> {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching user tickets:", error.message);
            return null;
        }

        console.log("User support tickets fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching user tickets:", err);
        return null;
    }
}

// ✅ Update Support Ticket Status
export async function updateSupportTicketStatus(ticketId: number, newStatus: string): Promise<SupportTicket | null> {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .update({ ticket_status: newStatus })
            .eq('ticket_id', ticketId)
            .single();

        if (error) {
            console.error("Error updating ticket status:", error.message);
            return null;
        }

        console.log("Support ticket status updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating ticket status:", err);
        return null;
    }
}

// ✅ Delete Support Ticket
export async function deleteSupportTicket(ticketId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('support_tickets')
            .delete()
            .eq('ticket_id', ticketId);

        if (error) {
            console.error("Error deleting support ticket:", error.message);
            return false;
        }

        console.log("Support ticket deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting support ticket:", err);
        return false;
    }
}
