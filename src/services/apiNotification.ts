import { supabase } from './SupabaseConfig';
import { Notification } from "@/types/Notification";

export async function createNotification(newNotification: Omit<Notification, 'notification_id' | 'created_at'>): Promise<Notification | null> {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([
                {
                    user_id: newNotification.user_id,
                    message: newNotification.message,
                    status: newNotification.status || 'Unread',
                },
            ])
            .single();

        if (error) {
            console.error("Error creating notification:", error.message);
            return null;
        }

        console.log("Notification created successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error creating notification:", err);
        return null;
    }
}

export async function getAllNotifications(): Promise<Notification[] | null> {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*');

        if (error) {
            console.error("Error fetching notifications:", error.message);
            return null;
        }

        console.log("Notifications fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching notifications:", err);
        return null;
    }
}

export async function getNotificationsByUserId(userId: number): Promise<Notification[] | null> {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching notifications:", error.message);
            return null;
        }

        console.log("User notifications fetched successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error fetching notifications:", err);
        return null;
    }
}

export async function updateNotificationStatus(notificationId: number, status: 'Unread' | 'Read'): Promise<Notification | null> {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ status })
            .eq('notification_id', notificationId)
            .single();

        if (error) {
            console.error("Error updating notification status:", error.message);
            return null;
        }

        console.log("Notification status updated successfully:", data);
        return data;
    } catch (err) {
        console.error("Unexpected error updating notification:", err);
        return null;
    }
}

export async function deleteNotification(notificationId: number): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('notification_id', notificationId);

        if (error) {
            console.error("Error deleting notification:", error.message);
            return false;
        }

        console.log("Notification deleted successfully");
        return true;
    } catch (err) {
        console.error("Unexpected error deleting notification:", err);
        return false;
    }
}
