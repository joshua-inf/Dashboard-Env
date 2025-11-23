export type Notification = {
    notification_id: number;
    user_id?: number | null;
    message: string;
    status?: string; // 'Unread' | 'Read'
    created_at?: string;
};
