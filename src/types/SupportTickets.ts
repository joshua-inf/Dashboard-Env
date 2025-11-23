export type SupportTicket = {
    ticket_id: number;
    user_id?: number | null;
    description: string;
    ticket_status: string;
    created_at: string;
};
