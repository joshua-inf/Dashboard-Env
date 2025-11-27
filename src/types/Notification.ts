export type Notification = {
    notification_id: number;
    user_id?: number | null;
    message: string;
    status?: string; // 'Unread' | 'Read'
    created_at?: string;
};

export interface NotificationDB {
    id: string;
    user_id: string;
    business_id: string;
    title: string;
    message: string;
    notification_type: "success" | "warning" | "info" | "error";
    priority: "low" | "normal" | "high";
    status: "read" | "unread" | "dismissed";
    category: "order" | "payment" | "security" | "system" | "promotion";
    action_url: string | null;
    action_label: string | null;
    metadata: Record<string, any>;
    tags: string[];
    expires_at: string | null;
    created_at: string;
    updated_at: string;
    read_at: string | null;
    dismissed_at: string | null;
}